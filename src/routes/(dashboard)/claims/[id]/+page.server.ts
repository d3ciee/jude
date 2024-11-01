import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals, params }) => {
    if (!locals.session) {
        error(401, {
            message: "Please login to access this page"
        });
    }

    const props = await locals.services.claims.getClaim(params.id)

    console.log(props)

    return {
        props
    };
});