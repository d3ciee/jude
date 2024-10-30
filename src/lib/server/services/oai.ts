import { JUDE, JUDE_EYE, JUDE_SPECTRE, JUDE_STALKER, OPENAI_API_KEY } from '$env/static/private';
import type { GptOcrResponse, GptProviderResponse, GptAnalysisResponse, GptResponseType, GptSocialProfilerResponse } from '$lib/types';
import { OpenAI, toFile } from 'openai';
import type winston from 'winston';

class OpenAIService {
    private client: OpenAI;
    private logger: winston.Logger;
    private analysisAssistantId: string;
    private ocrAssistantId: string;
    private socialProfilerAssistantId: string;
    private providerInspectorAssistantId: string;

    constructor(logger: winston.Logger) {
        this.client = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });
        this.logger = logger;

        this.analysisAssistantId = JUDE;
        this.ocrAssistantId = JUDE_EYE;
        this.socialProfilerAssistantId = JUDE_STALKER;
        this.providerInspectorAssistantId = JUDE_SPECTRE;
    }

    async analyzeDocument(fileBuffer: Buffer, fileName: string) {
        try {

            const file = await this.client.files.create({
                file: await toFile(fileBuffer, fileName),
                purpose: 'assistants',
            });

            const thread = await this.client.beta.threads.create();

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

            const run = await this.client.beta.threads.runs.create(thread.id, {
                assistant_id: this.analysisAssistantId,
            });

            const response = await this.waitForRunCompletion<GptAnalysisResponse>(thread.id, run.id);
            return response;

        } catch (error) {
            this.logger.error('Error analyzing document with OpenAI:', error);
            throw error;
        }
    }

    async performOCR(fileBuffer: Buffer, fileName: string) {
        try {

            const file = await this.client.files.create({
                file: await toFile(fileBuffer, fileName),
                purpose: 'assistants',
            });

            const thread = await this.client.beta.threads.create();

            const fileExt = fileName.split('.').pop();

            if (fileExt === 'pdf') {
                await this.client.beta.threads.messages.create(thread.id, {
                    role: 'user',
                    content: 'Please extract data from this document.',
                    attachments: [{
                        file_id: file.id,
                        tools: [
                            {
                                type: 'file_search'
                            }
                        ]
                    }],
                });
            }

            if (fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png') {
                await this.client.beta.threads.messages.create(thread.id, {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: "Please extract from this image."
                        },
                        {
                            type: 'image_file',
                            image_file: {
                                file_id: file.id,
                            }
                        }
                    ]
                });
            }
            else {
                throw new Error('File type not supported');
            }

            const run = await this.client.beta.threads.runs.create(thread.id, {
                assistant_id: this.ocrAssistantId,
            });

            const response = await this.waitForRunCompletion<GptOcrResponse>(thread.id, run.id);
            return response;

        } catch (error) {
            this.logger.error('Error extracting data from document:', error);
            throw error;
        }
    }

    async performSocialProfiling(name: string) {
        try {

            const thread = await this.client.beta.threads.create();

            if (name) {
                await this.client.beta.threads.messages.create(thread.id, {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Please profile this person: ${name}`
                        },
                    ]
                });
            }
            else {
                throw new Error('name must not be null');
            }

            const run = await this.client.beta.threads.runs.create(thread.id, {
                assistant_id: this.socialProfilerAssistantId,
            });

            const response = await this.waitForRunCompletion<GptSocialProfilerResponse>(thread.id, run.id);
            return response;

        } catch (error) {
            this.logger.error('Error whilst profiling:', error);
            throw error;
        }
    }

    async performProviderProfiling(provider: string) {
        try {

            const thread = await this.client.beta.threads.create();

            if (provider) {
                await this.client.beta.threads.messages.create(thread.id, {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Please profile this health provider in case of similar names lean towards Zimbabwefan Providers: ${provider}`
                        },
                    ]
                });
            }
            else {
                throw new Error('provider must not be null');
            }

            const run = await this.client.beta.threads.runs.create(thread.id, {
                assistant_id: this.providerInspectorAssistantId,
            });

            const response = await this.waitForRunCompletion<GptProviderResponse>(thread.id, run.id);
            return response;

        } catch (error) {
            this.logger.error('Error whilst profiling:', error);
            throw error;
        }
    }

    private async waitForRunCompletion<T extends GptResponseType>(threadId: string, runId: string): Promise<Result<T>> {
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
            const parsedResponse = JSON.parse(response) as T;
            return {
                success: true,
                data: parsedResponse
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to parse response`
            };
        }
    }

}

export default OpenAIService;
