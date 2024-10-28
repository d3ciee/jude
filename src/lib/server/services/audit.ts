import type winston from "winston";
import type { DB } from "../db";

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
        this.logger.info("TODO: IMPLEMENT AUDIT_SERVICE", data)
    }
}

export default AuditService;