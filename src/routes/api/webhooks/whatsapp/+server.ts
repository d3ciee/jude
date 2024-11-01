import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals }) => {
    return new Response();
}