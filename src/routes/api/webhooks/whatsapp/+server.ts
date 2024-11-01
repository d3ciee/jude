import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {

    const msisdn = "263777299683"
    try {
        console.dir(request.json(), { depth: Infinity });

        let message = ""

        // if (message == "hie") {
        //     await locals.providers.whatsapp.send({ msisdn, message: "hello, how can i help you today?" });
        // } else if message.contains() {

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