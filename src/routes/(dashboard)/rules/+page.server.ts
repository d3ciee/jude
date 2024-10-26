import type { CreateRule } from '$lib/types';

export const load = (async ({ locals }) => {
    const rules = await locals.services.rules.getAllRules();
    return {
        rules
    };
});

export const actions = {
    create: async ({ request, locals }) => {
        const data = await request.formData();
        const name = data.get('name');
        const description = data.get('description');

        if (!name || !description) {
            return {
                success: false,
                error: 'Name and description are required'
            };
        }

        const userId = "uuid123";

        const createRuleDTO: CreateRule = {
            name: name.toString(),
            description: description.toString()
        };

        await locals.services.rules.createRule(createRuleDTO, userId);

        return { success: true };
    }
};
