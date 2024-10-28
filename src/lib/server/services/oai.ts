import { OPENAI_API_KEY, OPENAI_ASSISTANT_ID } from '$env/static/private';
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

    private async waitForRunCompletion(threadId: string, runId: string) {
        let run = await this.client.beta.threads.runs.retrieve(threadId, runId);

        while (run.status === 'queued' || run.status === 'in_progress') {
            await new Promise(resolve => setTimeout(resolve, 1000));
            run = await this.client.beta.threads.runs.retrieve(threadId, runId);
        }

        if (run.status === 'completed') {
            const messages = await this.client.beta.threads.messages.list(threadId);
            return messages.data[0].content[0].type === 'text' ? messages.data[0].content[0].text : null;
        } else {
            throw new Error(`Run failed with status code: ${run.status}`);
        }
    }
}

export default OpenAIService;
