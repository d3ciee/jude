import type { Handle } from "@sveltejs/kit";
import init from "./lib/infra/db";
import RulesService from "$lib/services/rules";
import { createLogger, format, transports } from "winston";


const hook: Handle = ({ event, resolve }) => {
    const db = init();
    const logger = createLogger({
        level: 'info',
        format: format.combine(
            format.colorize(),
            format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)
        ),
        transports: [
            new transports.Console(),
        ],
    });

    event.locals.db = db;
    event.locals.logger = logger;
    event.locals.services = {
        rules: new RulesService(db, logger)
    }

    return resolve(event);
}

export default hook;