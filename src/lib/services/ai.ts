import { GOOGLE_API_KEY } from '$env/static/private';
import { createGoogleGenerativeAI, type GoogleGenerativeAIProvider } from '@ai-sdk/google';

class AIService {
    private googleGenerativeAIProvider: GoogleGenerativeAIProvider;

    constructor() {
        this.googleGenerativeAIProvider = createGoogleGenerativeAI(
            {
                apiKey: GOOGLE_API_KEY,
            }
        );
    }

    async extractTextFromDocument(imageUrl: string) {
        //return this.googleGenerativeAIProvider("gemini-pro").doGenerate({inputFormat:"prompt",prompt:[{content:}]})
    }
}