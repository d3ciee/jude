import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name');
        const description = data.get('description');
    }
};