import type { Handle } from "@sveltejs/kit";
import init from "$lib/server/db";
import RulesService from "$lib/server/services/rules";
import OpenAIService from "$lib/server/services/oai";
import { createLogger, format, transports } from "winston";
import genId from "$lib/utils/gen-id";

export const handle: Handle = async ({ event, resolve }) => {
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

    const userId = "uuid123";
    const requestId = genId(16);

    const requestContext: App.RequestContext = {
        userId,
        requestId
    }

    //HAVE JUST CREATED A FAKE SESSION TILL WE HAVE SOMETHING IN PLACE,
    //OTHERWISE FINE
    event.locals.session = {
        id: "fake_session",
        createdAt: Date.now(),
        expiresAt: Date.now(),
        userId,
        userAgent: "fake_user_agent",
        ipAddress: "fake_ip_address"

    }
    event.locals.db = db;
    event.locals.logger = logger.child({ requestId });
    event.locals.services = {
        rules: new RulesService(requestContext, db, logger),
        oai: new OpenAIService(logger)
    }

    return await resolve(event);
}

//TODO: ADD HTTP LOGGING TO AS A HOOK