import { WhatsappSession } from '$lib/server/db/schema';
import genId from '$lib/utils/gen-id';
import { eq } from 'drizzle-orm';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {

    const msisdn = "263777299683"
    let message = ""
    try {
        console.dir(await request.json(), { depth: Infinity });

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

        console.log("session", session)

        if (session.step == 1) {
            locals.db.update(WhatsappSession).set({ step: 2 }).where(eq(WhatsappSession.id, session.id))
            await locals.providers.whatsapp.send({ msisdn, message: "hello, please send your member number" });
        } else if (session.step == 2) {
            locals.db.update(WhatsappSession).set({ step: 3 }).where(eq(WhatsappSession.id, session.id))
            await locals.providers.whatsapp.send({ msisdn, message: "great, now please send your documents, type done when finished" });
        } else if (session.step == 3) {
            //check if the message is of type image and upload to s3


            if (false) {

            }

        }

    } catch (e) {
        console.log(e);
    }
    return new Response();
}

export const GET: RequestHandler = async ({ request, locals, url }) => {

    const verifyToken = url.searchParams.get('hub.verify_token') || "";
    const challenge = url.searchParams.get('hub.challenge') || "";

    return new Response(challenge);
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


