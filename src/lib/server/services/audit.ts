import type winston from "winston";
import type { DB } from "../db";
import { AuditLog } from "../db/schema";
import genId from "$lib/utils/gen-id";
import { count } from "drizzle-orm";

type TAuditLog = typeof AuditLog.$inferInsert & { user: { name: string, email: string } };

class AuditService {
    private db: DB;
    private logger: winston.Logger;

    constructor(db: DB, logger: winston.Logger) {
        this.db = db;
        this.logger = logger.child({ service: "audit" });
    }

    async log(data: {
        userId: string;
        action: string;
        details: string;
    }): Promise<void> {

        try {
            await this.db.insert(AuditLog).values({
                id: genId(),
                userId: data.userId,
                action: data.action,
                details: data.details,
                createdAt: Date.now()
            })
        } catch (e) {
            this.logger.error("failed to log audit", e)
        }
    }

    async getListOfLogs(input: { limit: number; offset: number }): Promise<Result<{ total: number, logs: TAuditLog[] }>> {
        this.logger.info("fetching logs from db")
        this.logger.debug("input", input)

        try {
            const logs = await this.db.query.AuditLog.findMany({
                limit: input.limit,
                offset: input.offset,
                with: {
                    user: {
                        columns: {
                            name: true,
                            email: true
                        }
                    }
                }
            });

            const total = (await this.db.select({ count: count() }).from(AuditLog).execute()).at(0)?.count ?? 0;
            this.logger.info("logs fetched succesfully", { logs, total })

            return {
                success: true,
                data: {
                    total,
                    logs,
                }
            }
        } catch (e) {
            this.logger.error("error getting logs from db", e)
            return {
                success: false,
                error: "Failed to fetch logs"
            }
        }
    }
}

export default AuditService;