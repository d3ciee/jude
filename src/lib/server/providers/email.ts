import { MAILGUN_API_KEY, MAILGUN_DOMAIN } from "$env/static/private";
import Mailgun from "mailgun.js"
import type { IMailgunClient } from "mailgun.js/Interfaces";
import type winston from "winston";

class EmailProvider {
    private logger: winston.Logger;
    private mg: IMailgunClient;

    constructor(logger: winston.Logger) {
        this.logger = logger.child({ provider: "email" });
        this.mg = new Mailgun(FormData).client({ username: "api", key: MAILGUN_API_KEY });
    }

    public async sendEmail(input: { to: string, subject: string, text: string, html?: string }) {
        this.logger.info("sending email");
        this.logger.debug("input", input);
        try {
            const result = await this.mg.messages.create(MAILGUN_DOMAIN, {
                text: input.text,
                subject: input.subject,
                to: input.to,
                from: `CIMAS CLAIMS APPLICATIONS <cimas-claims@${MAILGUN_DOMAIN}>`
            });
            if (result.status > 299) {
                throw new Error("email not sent");
            }
            this.logger.info("email sent successfully", { result });
        } catch (e) {
            this.logger.error("error sending email", e);
            console.error(e);
        }
    }
}

export default EmailProvider;