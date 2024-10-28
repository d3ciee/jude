import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {


    const data = await request.formData()

    console.log(data)


    return new Response();
};
