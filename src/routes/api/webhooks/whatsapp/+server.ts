import { WhatsappSession } from '$lib/server/db/schema';
import genId from '$lib/utils/gen-id';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {

    const msisdn = "263777299683"
    let message = ""
    try {
        console.dir(request.json(), { depth: Infinity });

        let session: any;

        session = await locals.db.query.WhatsappSession.findFirst({
            where: ({ msisdn }, { eq }) => {
                return eq(msisdn, msisdn)
            }
        })

        if (!session) {
            session = await locals.db.insert(WhatsappSession).values({
                id: genId(),
                createdAt: Date.now(),
                msisdn: msisdn,
                step: 1,
                status: "active"
            })
        }

        if (session.step == 1) {
            await locals.providers.whatsapp.send({ msisdn, message: "hello, please send your member number" });
        } else if (session.step == 2) {

            await locals.providers.whatsapp.send({ msisdn, message: "great, now please send your documents, type done when finished" });
        }




        // if (message == "hie") {
        //     await locals.providers.whatsapp.send({ msisdn, message: "hello, how can i help you today?" });
        // } else if message.contains() {



        // const WhatsappSession = sqliteTable("whatsapp_session", {
        //     id: text("id").notNull().primaryKey(),
        //     createdAt: integer("created_at").notNull(),
        //     expiresAt: integer("expires_at").notNull(),
        //     userId: text("user_id").notNull().references(() => User.id),
        //     msisdn: text("msisdn").notNull(),
        //     step: integer("step").default(0),
        //     provider: text("provider").notNull(),
        //     status: text("status", { enum: ["active", "inactive"] }).notNull(),
        //     metadata: text("metadata", { mode: "json" })
        // })


        // }



    } catch (e) {

    }
    return new Response();
}

export const GET: RequestHandler = async ({ request, locals, url }) => {

    const verifyToken = url.searchParams.get('hub.verify_token') || "";
    const challenge = url.searchParams.get('hub.challenge') || "";

    return new Response(challenge);
}