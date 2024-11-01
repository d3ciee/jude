import { WHATSAPP_SECRET } from "$env/static/private";
import type winston from "winston";

class WhatsappProvider {
    private waSecret: string;
    constructor(logger: winston.Logger) {
        this.waSecret = WHATSAPP_SECRET;
    }

    async send({ msisdn, message }: { msisdn: string, message: string }) {
        const result = await fetch("https://graph.facebook.com/v20.0/475617168964724/messages", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${this.waSecret}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: msisdn,
                type: "text",
                text: {
                    body: message
                }
            })
        });

        console.log(await result.json());


    }

}

export default WhatsappProvider