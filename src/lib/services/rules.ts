import type { DB } from "$lib/infra/db";
import { Rules } from "$lib/infra/db/schema";
import genId from "$lib/utils/gen-id";
import type winston from "winston";

class RulesService {
    private db: DB;
    private logger: winston.Logger;

    constructor(db: DB, logger: winston.Logger) {
        this.db = db;
        this.logger = logger;
    }

    async getAllRules() {
        this.logger.info("getting rules from db")
        return this.db.query.Rules.findMany();
    }

    async createRule(data: { name: string, description: string, userId: string }) {
        this.logger.info("creating rule", data)
        return this.db.insert(Rules).values({
            active: true,
            name: data.name,
            createdAt: Date.now(),
            createdBy: data.userId,
            description: data.description,
            id: genId(),
        }).execute();
    }
}

export default RulesService