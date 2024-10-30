import { error } from '@sveltejs/kit';

export const actions = {
    analyze: async ({ request, locals }) => {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            throw error(400, 'No file uploaded');
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await locals.services.oai.analyzeDocument(buffer, file.name);

        return { result };
    },

    ocr: async ({ request, locals }) => {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            throw error(400, 'No file uploaded');
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await locals.services.oai.performOCR(buffer, file.name);

        return { result };
    },

    profileSocial: async ({ request, locals }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;

        if (!name) {
            throw error(400, 'No name provided');
        }

        const result = await locals.services.oai.performSocialProfiling(name);

        return { result };
    },

    profileProvider: async ({ request, locals }) => {
        const formData = await request.formData();
        const provider = formData.get('provider') as string;

        if (!provider) {
            throw error(400, 'No provider name provided');
        }

        const result = await locals.services.oai.performProviderProfiling(provider);

        return { result };
    }
}
