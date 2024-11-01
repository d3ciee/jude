import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        console.dir(request.json(), { depth: Infinity });
    } catch (e) {

    }
    return new Response();
}

export const GET: RequestHandler = async ({ request, locals, url }) => {

    const verifyToken = url.searchParams.get('hub.verify_token') || "";
    const challenge = url.searchParams.get('hub.challenge') || "";

    let response = new Response();
    response.headers.set('hub.challenge', challenge);
    response.headers.set('hub.verify_token', verifyToken);

    return response;
}