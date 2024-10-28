import type winston from "winston";
import type { DB } from "../db";
import { Claim, File, type TClaim, type TFile } from "../db/schema";
import genId from "$lib/utils/gen-id";
import StorageProvider from "../providers/storage";
import AuditService from "./audit";
import { count } from "drizzle-orm";

class ClaimsService {
    private db: DB;
    private logger: winston.Logger;

    private auditService: AuditService;

    private storageProvider: StorageProvider;
    private requestContext: App.RequestContext;

    public static GET_LIST_OF_CLAIMS_DEFAULT_LIMIT = 10;

    constructor(context: App.RequestContext, db: DB, logger: winston.Logger) {
        this.requestContext = context;
        this.db = db;

        this.logger = logger.child({ service: "claims" });
        this.auditService = new AuditService(db, logger);
        this.storageProvider = new StorageProvider(this.logger);
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

    async createClaim(input: {
        submittedBy: TClaim["submittedBy"];
        membershipNumber: string;
        submissionChannel: TClaim["submissionChannel"];
        files: { name: string, size: number, type: string, object: Buffer }[];
    }): Promise<Result<{ id: string }>> {
        this.logger.info("creating claim");
        this.logger.debug("input", input);

        const claimId = genId();
        try {
            // using batch api as im not too sure if 
            // the transaction api is supported for libsql
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
                        return {
                            id: genId(),
                            claimId: claimId,
                            fileStorageKey: s.data.storageKey,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            createdAt: Date.now(),
                        }
                    })))
            ])


            this.auditService.log({
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