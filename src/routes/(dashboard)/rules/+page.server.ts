import { error, fail } from '@sveltejs/kit';

export const load = (async ({ locals, url }) => {
    if (!locals.session) {
        error(401, {
            message: "Please login to access this page"
        });
    }

    const offset = Number(url.searchParams.get('offset')) || 0;
    const props = await locals.services.rules.getListOfRules({
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

        const data = await request.formData();
        const name = data.get('name')?.toString();
        const description = data.get('description')?.toString();

        if (!name || !description) {
            return {
                success: false,
                error: 'Name and description are required'
            };
        }

        const result = await locals.services.rules.createRule({
            description,
            name,
        });

        if (!result.success) {
            return fail(500, {
                message: result.error
            });
        }
        return;
    },
    update: async ({ request, locals }) => {
        if (!locals.session) {
            return fail(401, {
                message: "Unauthorized"
            });
        }

        const data = await request.formData();
        const id = data.get('id')?.toString();
        const name = data.get('name')?.toString();
        const description = data.get('description')?.toString();
        const active = data.get('active') === "on";

        if (!id || !name || !description) {
            return fail(400, {
                message: "Name and description are required"
            })
        }

        const result = await locals.services.rules.updateRule(id, {
            name,
            description,
            active,
        })

        if (!result.success) {
            return fail(500, {
                message: result.error
            });
        }

        return;
    },
    delete: async ({ request, locals }) => {
        if (!locals.session) {
            return fail(401, {
                message: "Unauthorized"
            });
        }

        const data = await request.formData();
        const id = data.get('id')?.toString();
        if (!id) {
            return fail(404, {
                message: "Rule not found"
            });
        }

        const result = await locals.services.rules.deleteRule(id);
        if (!result.success) {
            return fail(500, {
                message: result.error
            });
        }
        return;
    }
};
