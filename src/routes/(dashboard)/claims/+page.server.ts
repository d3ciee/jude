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
        const membershipNumber = formData.get("membership-number") as string;
        const numberOfFiles = Number(formData.get('number-of-files'));

        if (!submittedBy || !Claim.submittedBy.enumValues.includes(submittedBy) || !membershipNumber) {
            return fail(400, { message: 'Invalid submition provided' });
        }
        if (!numberOfFiles) {
            return fail(400, { message: 'No files uploaded' });
        }

        const files = await Promise.all(Array.from({ length: numberOfFiles }, async (_, i) => {
            const file = formData.get(`file-${i}`) as File;

            return {
                name: file.name,
                size: file.size,
                object: Buffer.from(await file.arrayBuffer())
            }
        }));

        const result = await locals.services.claims.createClaim({
            submittedBy,
            submissionChannel: 'portal',
            membershipNumber,
            files
        })

        if (!result.success) {
            return fail(500, { message: result.error });
        }

        return;
    },
};
