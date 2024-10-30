import { SERPER_API_KEY } from "$env/static/private";
import type winston from "winston";


type SerpKnowledgeGraph = {
    title: string;
    type: string;
    website: string;
    rating: number;
    ratingCount: number;
    imageUrl: string;
    attributes: Record<string, string>;
}

type SerpOrganicResult = {
    title: string;
    link: string;
    snippet: string;
    position: number;
    sitelinks?: { title: string, link: string }[];
}


class SerpProvider {
    private serperApiKey: string;
    private logger: winston.Logger;

    constructor(logger: winston.Logger) {
        this.logger = logger.child({ provider: "serp" });
        this.serperApiKey = SERPER_API_KEY;
    }

    public async search(input: { q: string, gl: string, type?: string }): Promise<Result<{ knowledgeGraph?: SerpKnowledgeGraph, organic: SerpOrganicResult[] }>> {
        try {
            const result = await fetch("https://google.serper.dev/" + (input.type ? "search" : input.type), {
                method: 'POST',
                headers: {
                    'X-API-KEY': this.serperApiKey,
                    'Content-Type': 'application/json'
                },
                redirect: 'follow',
                body: JSON.stringify(input)
            });
            if (!result.ok) {
                throw new Error(`Failed to fetch serp: ${result.statusText}`);
            }

            const data = await result.json();
            return {
                success: true,
                data
            }
        } catch (e) {
            this.logger.error("error getting serp from serper", e)
            return {
                success: false,
                error: "An unexpected error occurred.  Try again later"
            }
        }
    }
}

export default SerpProvider;