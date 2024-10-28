import type { DB } from "../db";
import { Rule } from "../db/schema";
import genId from "../../utils/gen-id";
import type winston from "winston";
import type { Rule as TRule, CreateRule, GetListOfRules } from "$lib/types";
import { count, eq } from "drizzle-orm";
import AuditService from "./audit";
import { isDuplicateKeyError } from "../db/helpers";

class RulesService {
    private db: DB;
    private logger: winston.Logger;
    private requestContext: App.RequestContext;

    private auditService: AuditService;

    public static GET_LIST_OF_RULES_DEFAULT_LIMIT = 10;

    constructor(requestContext: App.RequestContext, db: DB, logger: winston.Logger) {
        this.requestContext = requestContext;
        this.db = db;
        this.logger = logger.child({ service: "rules" });

        this.auditService = new AuditService(db, logger);
    }

    async getListOfRules(input: { limit: number; offset: number }): Promise<Result<{
        rules: TRule[];
        total: number;
    }>> {
        this.logger.info("fetching rules from db")
        this.logger.debug("input", input)

        try {
            const rules = await this.db.query.Rule.findMany({
                limit: input.limit ?? RulesService.GET_LIST_OF_RULES_DEFAULT_LIMIT,
                offset: input.offset ?? 0,
                with: {

                    createdBy: {
                        columns: {
                            name: true,
                            email: true,
                            id: true
                        }
                    }
                }
            });
            const total = (await this.db.select({ count: count() }).from(Rule).execute()).at(0)?.count ?? 0;
            this.logger.info("rules fetched succesfully", { rules, total })

            return {
                success: true,
                data: {
                    rules,
                    total
                }
            }
        } catch (e) {
            this.logger.error("error getting rules from db", e)
            return {
                success: false,
                error: "An unexpected error occurred.  Try again later"
            }
        }
    }

    async createRule(input: {
        name: string;
        description: string;
    }): Promise<Result<{ id: string }>> {
        this.logger.info("creating rule")
        this.logger.debug("input", input)

        try {
            const id = genId();
            await this.db.insert(Rule).values({
                active: true,
                name: input.name,
                createdAt: Date.now(),
                createdBy: this.requestContext.userId,
                description: input.description,
                id,
            }).execute();
            this.logger.info("rule created successfully")

            this.auditService.log({
                userId: this.requestContext.userId,
                action: "rule:create",
                details: `created rule with id '${id}'`
            })
            return { success: true, data: { id } }
        } catch (e) {
            if (isDuplicateKeyError(e, Rule.name)) {
                return { success: false, error: `Rule with the name ${input.name} already exists` }
            }
            this.logger.error("error creating rule", e)
            return { success: false, error: "An unexpected error occurred.  Try again later" }
        }
    }

    async updateRule(id: string, patch: { name: string, description: string, active: boolean }): Promise<Result<null>> {
        this.logger.info(`updating rule with id '${id}'`)
        this.logger.debug("patch", patch)

        try {
            const result = await this.db.update(Rule).set({
                name: patch.name,
                active: patch.active,
                description: patch.description
            }).where(eq(Rule.id, id)).execute();
            if (result.rowsAffected === 0) {
                return { success: false, error: "Rule not found" }
            }
            this.logger.info(`rule '${id}' updated successfully`)

            this.auditService.log({
                userId: this.requestContext.userId,
                action: "rule:update",
                details: `updated rule with id '${id}'`
            })

            return { success: true, data: null }
        } catch (e) {
            this.logger.error("error updating rule", e)
            return { success: false, error: "An unexpected error occurred.  Try again later" }
        }
    }

    async deleteRule(id: string): Promise<Result<null>> {
        this.logger.info(`deleting rule with id '${id}'`)
        try {
            const result = await this.db.delete(Rule).where(eq(Rule.id, id)).execute();
            if (result.rowsAffected === 0) {
                return { success: false, error: "Rule not found" }
            }
            this.logger.info(`deleted rule '${id}'`)

            this.auditService.log({
                userId: this.requestContext.userId,
                action: "rule:delete",
                details: `deleted rule with id '${id}'`
            })

            this.logger.info("rule deleted successfully")
            return { success: true, data: null }
        } catch (e) {
            this.logger.error("error deleting rule", e)
            return { success: false, error: "An unexpected error occurred.  Try again later" }
        }
    }
}

export default RulesService
