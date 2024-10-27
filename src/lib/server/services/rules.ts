import type { DB } from "../db";
import { Rules } from "../db/schema";
import genId from "../../utils/gen-id";
import type winston from "winston";
import type { Rule, CreateRule } from "$lib/types";

class RulesService {
    private db: DB;
    private logger: winston.Logger;

    constructor(db: DB, logger: winston.Logger) {
        this.db = db;
        this.logger = logger;
    }

    async getAllRules(): Promise<Rule[]> {
        this.logger.info("getting rules from db")
        const rules = await this.db.query.Rules.findMany();
        console.log(rules)
        return rules;
    }

    async createRule(data: CreateRule, userId: string): Promise<void> {
        this.logger.info("creating rule", { data })
        const rule = {
            active: true,
            name: data.name,
            createdAt: Date.now(),
            createdBy: userId,
            description: data.description,
            id: genId(),
        };
        this.logger.info("inserting rule", { rule })
        await this.db.insert(Rules).values(rule).execute();
    }
}

export default RulesService
