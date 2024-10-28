import { error } from '@sveltejs/kit';

export const actions = {
    analyze: async ({ request, locals }) => {
        try {
            const formData = await request.formData();
            const file = formData.get('file') as File;

            if (!file) {
                return {
                    success: false,
                    error: 'No file uploaded'
                };
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const result = await locals.services.oai.analyzeDocument(buffer, file.name);
            
            return result;
        } catch (e) {
            console.error('Error analyzing document:', e);
            return {
                success: false,
                error: 'An unexpected error occurred while analyzing the document'
            };
        }
    }
}
