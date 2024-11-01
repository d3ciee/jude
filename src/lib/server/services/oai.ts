import { JUDE, OPENAI_API_KEY } from '$env/static/private';
import type { GptOcrResponse, GptProviderResponse, GptClaimAnalysisResponse, GptResponseType, GptSocialProfilerResponse, GptCostAnalysisResponse, Rule } from '$lib/types';
import { OpenAI, toFile } from 'openai';
import type winston from 'winston';
import SerpProvider from '../providers/serp';
import { OCR_SYSTEM_PROMPT, PROVIDER_INSPECTOR_SYSTEM_PROMPT, SOCIAL_PROFILER_SYSTEM_PROMPT, COST_ANALYSIS_SYSTEM_PROMPT } from '$lib/utils/sys';
import type { ImageFileContentBlock, MessageContentPartParam, TextContentBlockParam } from 'openai/resources/beta/threads/messages.mjs';

class OpenAIService {
    private client: OpenAI;
    private logger: winston.Logger;
    private analysisAssistantId: string;
    private serpProvider: SerpProvider;

    constructor(logger: winston.Logger) {
        this.client = new OpenAI({
            apiKey: OPENAI_API_KEY,
        });
        this.logger = logger;
        this.serpProvider = new SerpProvider(logger);
        this.analysisAssistantId = JUDE;
    }

    async analyzeDocument(files: Array<{ buffer: Buffer; name: string }>, rules?: Rule[]) {
        try {
            if (!files.length) {
                throw new Error('At least one file must be provided');
            }

            const uploadedFiles = await Promise.all(files.map(async ({ buffer, name }) => {
                const fileExt = name.split('.').pop()?.toLowerCase();
                if (!fileExt || !['jpg', 'jpeg', 'png'].includes(fileExt)) {
                    throw new Error('Only image files (jpg, jpeg, png) are supported');
                }
                return this.client.files.create({
                    file: await toFile(buffer, name),
                    purpose: 'assistants',
                });
            }));

            const thread = await this.client.beta.threads.create();

            const content: (MessageContentPartParam | ImageFileContentBlock)[] = [
                ...uploadedFiles.map(file => ({
                    type: 'image_file',
                    image_file: {
                        file_id: file.id,
                        detail: 'auto'
                    }
                } as ImageFileContentBlock)),

                ...(rules?.map(rule => ({
                    type: 'text',
                    text: rule.description
                } as MessageContentPartParam)) ?? [])
            ];

            await this.client.beta.threads.messages.create(thread.id, {
                role: 'user',
                content: content,
                attachments: [],
            });

            const run = await this.client.beta.threads.runs.create(thread.id, {
                assistant_id: this.analysisAssistantId,
            });

            const response = await this.waitForRunCompletion<GptClaimAnalysisResponse>(thread.id, run.id);

            return response;

        } catch (error) {
            this.logger.error('Error analyzing document with OpenAI:', error);
            throw error;
        }
    }

    async performOCR(fileBuffer: Buffer, fileName: string) {
        try {
            const fileExt = fileName.split('.').pop()?.toLowerCase();

            if (!fileExt || !['jpg', 'jpeg', 'png'].includes(fileExt)) {
                throw new Error('Only image files (jpg, jpeg, png) are supported');
            }

            const base64Image = fileBuffer.toString('base64');

            const response = await this.client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: OCR_SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Please extract data from this image."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/${fileExt};base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 4096,
                response_format: {
                    type: "json_object"
                }
            });

            const result = JSON.parse(response.choices[0].message.content || "{}") as GptOcrResponse;
            return { success: true, data: result };

        } catch (error) {
            this.logger.error('Error extracting data from image:', error);
            throw error;
        }
    }


    async performSocialProfiling(name: string) {
        try {
            if (!name) {
                throw new Error('name must not be null');
            }

            const searchResult = await this.serpProvider.search({
                q: `${name} profile background information`,
                gl: "ZW"
            });

            const imageResult = await this.serpProvider.search({
                q: `${name}`,
                gl: "ZW",
                type: "images"
            });

            this.logger.debug(`Search result: ${JSON.stringify(searchResult)}`);

            if (!searchResult.success) {
                throw new Error('Failed to fetch additional context');
            }

            const contextData = searchResult.data.organic.map(result => result.snippet).join('\n');

            const response = await this.client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: SOCIAL_PROFILER_SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: `Please profile this person: ${name}\n\nAdditional Context:\n${contextData}`
                    }
                ],
                max_tokens: 4096,
                response_format: {
                    type: "json_object"
                }
            });

            let result = JSON.parse(response.choices[0].message.content || "{}") as GptSocialProfilerResponse;

            if (imageResult.success) {
                //@ts-ignore
                result.extractedData.avatar = imageResult.data?.images[0]?.imageUrl
            }

            return { success: true, data: result };

        } catch (error) {
            this.logger.error('Error whilst profiling:', error);
            throw error;
        }
    }

    async performCostAnalysis(fileBuffer: Buffer, fileName: string): Promise<Result<GptCostAnalysisResponse>> {
        try {
            const fileExt = fileName.split('.').pop()?.toLowerCase();

            if (!fileExt || !['jpg', 'jpeg', 'png'].includes(fileExt)) {
                throw new Error('Only image files (jpg, jpeg, png) are supported');
            }

            const base64Image = fileBuffer.toString('base64');

            const response = await this.client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: COST_ANALYSIS_SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: [
                            {
                                type: "text",
                                text: "Please analyze the costs in this medical document."
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: `data:image/${fileExt};base64,${base64Image}`
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 4096,
                response_format: {
                    type: "json_object"
                }
            });

            const result = JSON.parse(response.choices[0].message.content || "{}") as GptCostAnalysisResponse;
            return { success: true, data: result };

        } catch (error) {
            this.logger.error('Error analyzing costs:', error);
            throw error;
        }
    }

    async performProviderProfiling(provider: string): Promise<Result<GptProviderResponse>> {
        try {
            if (!provider) {
                throw new Error('provider must not be null');
            }

            const searchResult = await this.serpProvider.search({
                q: `${provider} healthcare provider Zimbabwe services reviews`,
                gl: "ZW"
            });

            this.logger.debug(`Search result: ${JSON.stringify(searchResult)}`);


            if (!searchResult.success) {
                throw new Error('Failed to fetch additional context');
            }

            const contextData = searchResult.data.organic.map(result => result.snippet).join('\n');

            const response = await this.client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: PROVIDER_INSPECTOR_SYSTEM_PROMPT
                    },
                    {
                        role: "user",
                        content: `Please profile this health provider: ${provider}\n\nAdditional Context:\n${contextData}`
                    }
                ],
                max_tokens: 4096,
                response_format: {
                    type: "json_object"
                }
            });

            const result = JSON.parse(response.choices[0].message.content || "{}") as GptProviderResponse;
            return { success: true, data: result };

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
