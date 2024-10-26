export const load = (async (e) => {
    //const rules = await e.locals.services.rules.getAllRules();
    return {
        rules: []
    };
});

export const actions = {
    create: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name');
        const description = data.get('description');
    }
};