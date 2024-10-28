import { OPENAI_API_KEY, OPENAI_ASSISTANT_ID } from '$env/static/private';
import type { GptResponse } from '$lib/types';
import { OpenAI, toFile } from 'openai';
import type winston from 'winston';

class OpenAIService {
    private client: OpenAI;
    private logger: winston.Logger;
    private assistantId: string;

    constructor(logger: winston.Logger) {
        this.client = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });
        this.logger = logger;
        //from my open ai dashboard
        this.assistantId = OPENAI_ASSISTANT_ID;
    }

    async analyzeDocument(fileBuffer: Buffer, fileName: string) {
        try {
            // we first upload the file to the OpenAI API
            const file = await this.client.files.create({
                file: await toFile(fileBuffer, fileName),
                purpose: 'assistants',
            });

            // make a thread sort of like a chat
            const thread = await this.client.beta.threads.create();

            // add a message with the file to the thread(chat) 
            await this.client.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: 'Please analyze this document.',
                attachments: [{
                    file_id: file.id,
                    tools: [
                        {
                            type: 'file_search'
                        }
                    ]
                }],
            });

            // run the assistant
            const run = await this.client.beta.threads.runs.create(thread.id, {
                assistant_id: this.assistantId,
            });

            // wait for completion and get the response
            const response = await this.waitForRunCompletion(thread.id, run.id);
            return response;

        } catch (error) {
            this.logger.error('Error analyzing document with OpenAI:', error);
            throw error;
        }
    }

    private async waitForRunCompletion(threadId: string, runId: string): Promise<Result<GptResponse>> {

        const retrieveRun = async () => this.client.beta.threads.runs.retrieve(threadId, runId);
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        let run = await retrieveRun();

        while (run.status === 'queued' || run.status === 'in_progress') {
            await sleep(1000);
            run = await retrieveRun();
        }

        if (run.status !== 'completed') {
            return {
                success: false,
                error: `Run failed with status code: ${run.status}`
            };
        }

        const messages = await this.client.beta.threads.messages.list(threadId);
        const response = messages.data[0].content[0].type === 'text' ? messages.data[0].content[0].text.value : null;

        if (!response) {
            return {
                success: false,
                error: 'No response from OpenAI',
            };
        }

        try {
            const parsedResponse: GptResponse = JSON.parse(response);
            return {
                success: true,
                data: parsedResponse
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to parse response as GptResponse'
            };
        }
    }

}

export default OpenAIService;
