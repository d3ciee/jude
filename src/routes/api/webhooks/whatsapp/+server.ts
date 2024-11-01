import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    try {
        console.dir(request.json(), { depth: Infinity });
    } catch (e) {

    }
    return new Response();
}

export const GET: RequestHandler = async ({ request, locals }) => {
    return new Response();
}