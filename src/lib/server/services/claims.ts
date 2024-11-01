import type winston from "winston";
import type { DB } from "../db";
import { Claim, File, type TClaim, type TFile } from "../db/schema";
import genId from "$lib/utils/gen-id";
import StorageProvider from "../providers/storage";
import AuditService from "./audit";
import { count, eq } from "drizzle-orm";
import OpenAIService from "./oai";
import type { ClaimDoc, GptClaimAnalysisResponse } from "$lib/types";
import RulesService from "./rules";

class ClaimsService {
    private db: DB;
    private logger: winston.Logger;

    private auditService: AuditService;

    private storageProvider: StorageProvider;
    private requestContext: App.RequestContext;

    private oaiService: OpenAIService;
    private rulesService: RulesService;

    public static GET_LIST_OF_CLAIMS_DEFAULT_LIMIT = 10;

    constructor(context: App.RequestContext, db: DB, logger: winston.Logger) {
        this.requestContext = context;
        this.db = db;

        this.logger = logger.child({ service: "claims" });
        this.oaiService = new OpenAIService(logger);
        this.auditService = new AuditService(db, logger);
        this.storageProvider = new StorageProvider(this.logger);
        this.rulesService = new RulesService(context, db, logger);
    }

    async getListOfClaims(input: { limit: number; offset: number }): Promise<Result<{
        total: number;
        claims: Array<TClaim & { files: number }>;
    }>> {
        this.logger.info("fetching claims from db")
        this.logger.debug("input", input)

        try {
            const claims = (await this.db.query.Claim.findMany({
                limit: input.limit ?? ClaimsService.GET_LIST_OF_CLAIMS_DEFAULT_LIMIT,
                offset: input.offset ?? 0,
                orderBy(fields, operators) {
                    return operators.desc(fields.createdAt)
                },
                with: {
                    files: {

                        columns: {
                            id: true
                        }
                    }
                }
            })).map((claim) => ({ ...claim, files: claim.files.length }));


            const total = (await this.db.select({ count: count() }).from(Claim).execute()).at(0)?.count ?? 0;
            this.logger.info("claims fetched succesfully", { claims, total })

            return {
                success: true,
                data: {
                    total,
                    claims,
                }
            }
        } catch (e) {
            this.logger.error("error getting claims from db", e)
            return {
                success: false,
                error: "An unexpected error occurred.  Try again later"
            }
        }

    }


    async getClaim(id: string): Promise<Result<{
        claim: TClaim & { files: TFile[] };
        analysis?: GptClaimAnalysisResponse;
    }>> {
        this.logger.info(`fetching claim '${id}' from db`)

        try {
            const claim = (await this.db.query.Claim.findFirst({
                where(f, { eq }) {
                    return eq(f.id, id)
                },
                with: {
                    files: true
                }
            }));
            if (!claim) {
                return {
                    success: false,
                    error: "Claim not found"
                }
            }

            this.logger.info("claim fetched succesfully", { claims: claim })

            return {
                success: true,
                data: {
                    claim,
                    analysis: claim.analysis
                }
            }
        } catch (e) {
            this.logger.error("error getting claim from db", e)
            return {
                success: false,
                error: "An unexpected error occurred.  Try again later"
            }
        }

    }

    async createClaim(input: {
        submittedBy: TClaim["submittedBy"];
        membershipNumber: string;
        submissionChannel: TClaim["submissionChannel"];
        files: { name: string, size: number, object: Buffer }[];
    }): Promise<Result<{ id: string }>> {
        this.logger.info("creating claim");
        this.logger.debug("input", input);

        const claimId = genId();
        let patientName = "";
        let providerName = "";


        try {
            await this.db.batch([
                this.db.insert(Claim).values({
                    id: claimId,
                    status: "pending",
                    submittedBy: input.submittedBy,
                    membershipNumber: input.membershipNumber,
                    procesingStep: "pending",
                    submissionChannel: input.submissionChannel,
                    createdAt: Date.now(),
                }),
                this.db.insert(File).values(
                    await Promise.all(input.files.map(async (file) => {
                        const s = await this.storageProvider.put({
                            extension: file.name.split('.')[1] || "",
                            name: file.name.split('.')[0],
                            object: file.object,
                        })
                        if (!s.success) throw new Error(s.error);

                        const ocr = await this.oaiService.performOCR(file.object, file.name);

                        var claim = ocr.data.extractedData as ClaimDoc

                        patientName = claim.patientName

                        if (!ocr.success) throw new Error("ocr failed")
                        return {
                            id: genId(),
                            claimId: claimId,
                            fileStorageKey: s.data.storageKey,
                            type: ocr.data.documentType,
                            extractedData: ocr.data.extractedData,
                            size: file.size,
                            confidence: ocr.data.confidenceLevel.toString(),
                            name: file.name,
                            createdAt: Date.now(),
                        }
                    })))
            ])

            await this.db.update(Claim).set({ procesingStep: "parsing-files" })



            try {
                await Promise.all([
                    this.oaiService.performSocialProfiling(patientName)
                        .then(async (r) => {
                            if (r.success) {
                                await this.db.update(Claim)
                                    .set({
                                        procesingStep: "fetching-social-profile",
                                        socialProfile: r.data.extractedData,
                                        socialProfileConfidence: r.data.confidenceLevel.toString()
                                    })
                                    .where(eq(Claim.id, claimId))
                                    .execute();
                            }
                        }).catch((e) => {
                            this.logger.error("error fetching social profile", e)
                        }),

                    this.oaiService.performProviderProfiling(providerName)
                        .then(async (r) => {
                            if (r.success) {
                                await this.db.update(Claim)
                                    .set({
                                        procesingStep: "fetching-provider-profile",
                                        providerProfile: r.data.extractedData,
                                        providerProfileConfidence: r.data.confidenceLevel.toString()
                                    })
                                    .where(eq(Claim.id, claimId))
                                    .execute();
                            }
                        }).catch((e) => {
                            this.logger.error("error fetching provider profile", e)
                        }),

                    (async () => {
                        const files = input.files.map(file => ({
                            buffer: file.object,
                            name: file.name
                        }));
                        const rulesResult = await this.rulesService.getListOfRules({ limit: 100, offset: 0 });
                        const activeRules = rulesResult.success ? rulesResult.data.rules.filter(r => r.active) : [];
                        const analysis = await this.oaiService.analyzeDocument(files, activeRules);
                        if (analysis.success) {
                            await this.db.update(Claim)
                                .set({ analysis: analysis.data })
                                .where(eq(Claim.id, claimId))
                                .execute();
                        }
                    })().catch((e) => {
                        this.logger.error("error analyzing documents", e)
                    })
                ]);
            } catch (e) {
                this.logger.error("error processing claim analyses", e);
            }




            await this.auditService.log({
                userId: this.requestContext.userId,
                action: "claim:create",
                details: `created claim with id '${claimId}'`
            })
            this.logger.info("claim created successfully");

            return {
                success: true,
                data: {
                    id: claimId
                }
            };
        } catch (e) {
            this.logger.error("error creating claim", e);
            return {
                success: false,
                error: "An unexpected error occurred.  Try again later"
            };
        }
    }



}

export default ClaimsService