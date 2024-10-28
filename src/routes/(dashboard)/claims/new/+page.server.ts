import { error } from '@sveltejs/kit';

export const actions = {
    analyze: async ({ request, locals }) => {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            throw error(400, 'No file uploaded');
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const response = await locals.services.oai.analyzeDocument(buffer, file.name);
        const analysis = JSON.parse(response?.value);
        return { analysis };
    }
}
