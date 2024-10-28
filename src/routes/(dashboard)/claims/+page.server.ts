import { Claim, type TClaim } from '$lib/server/db/schema.js';
import { error, fail } from '@sveltejs/kit';

export const load = (async ({ locals, url }) => {
    if (!locals.session) {
        error(401, {
            message: "Please login to access this page"
        });
    }

    const offset = Number(url.searchParams.get('offset')) || 0;
    const props = await locals.services.claims.getListOfClaims({
        limit: 10,
        offset: offset
    });

    return {
        props
    };
});

export const actions = {
    create: async ({ request, locals }) => {
        if (!locals.session) {
            return fail(401, {
                message: "Unauthorized"
            });
        }

        const formData = await request.formData();
        const submittedBy = formData.get('submitted-by') as TClaim["submittedBy"];
        const numberOfFiles = Number(formData.get('number-of-files'));

        if (!submittedBy || !Claim.submittedBy.enumValues.includes(submittedBy)) {
            return fail(400, { message: 'Invalid submitter provided' });
        }
        if (!numberOfFiles) {
            return fail(400, { message: 'No files uploaded' });
        }

        const files = await Promise.all(Array.from({ length: numberOfFiles }, async (_, i) => {
            const file = formData.get(`file-${i}`) as File;

            return {
                name: file.name,
                size: file.size,
                object: await file.arrayBuffer(),
                type: formData.get(`file-${i}-type`),
            }
        }));

        const result = await locals.services.claims.createClaim({
            submittedBy,
            submissionChannel: 'portal',
            files
        })

        if (!result.success) {
            return fail(500, { message: result.message });
        }

        return;
    },
};
