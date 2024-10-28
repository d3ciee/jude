import { R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_ENDPOINT, R2_SECRET_ACCESS_KEY, R2_REGION } from "$env/static/private";
import genId from "$lib/utils/gen-id";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type winston from "winston";

class StorageProvider {
    private s3Client: S3Client;
    private bucketName: string;

    private logger: winston.Logger;

    constructor(logger: winston.Logger) {

        this.logger = logger.child({ provider: "storage" });

        this.bucketName = R2_BUCKET_NAME;
        this.s3Client = new S3Client({
            endpoint: R2_ENDPOINT,
            region: R2_REGION,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID,
                secretAccessKey: R2_SECRET_ACCESS_KEY,
            },
            logger: this.logger,
        });
    }

    public async put(input: { name: string, extension: string, object: Buffer }): Promise<Result<{ storageKey: string }>> {
        const key = input.name + "_" + genId(12) + (input.extension ? "." + input.extension : "")
        this.logger.info(`putting object to storage with key '${key}'`);

        try {
            const putObjectCommand = new PutObjectCommand({
                Bucket: this.bucketName,
                Key: key,
                Body: input.object,
            });

            await this.s3Client.send(putObjectCommand);

            this.logger.info(`${key} put to storage successfully`);
            return {
                success: true,
                data: {
                    storageKey: key
                }
            }
        } catch (error) {
            this.logger.error("error putting object to storage", error);
            return {
                success: false,
                error: "An unexpected error occurred.  Try again later"
            }
        }
    }

    public async get(key: string): Promise<Result<{ object: Buffer }>> {
        try {
            const getObjectCommand = new GetObjectCommand({
                Bucket: this.bucketName,
                Key: key,
            })

            const response = await this.s3Client.send(getObjectCommand);
            const object = await response.Body?.transformToByteArray();

            if (!object) {
                return {
                    success: false,
                    error: "Object not found"
                }
            }

            return {
                success: true,
                data: {
                    object: Buffer.from(object)
                }
            }
        } catch (e) {
            this.logger.error("error getting object from storage", e);
            return {
                success: false,
                error: "An unexpected error occurred.  Try again later"
            }
        }
    }
}

export default StorageProvider;