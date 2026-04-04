import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const sendWebhook = async (action: string, model: string, entry: any) => {
    const url = process.env.STRAPI_WEBHOOK_URL;
    const secret = process.env.STRAPI_WEBHOOK_SECRET;

    if (!url || !secret) {
        console.warn("STRAPI_WEBHOOK_URL or STRAPI_WEBHOOK_SECRET not defined.");
        return;
    }

    const payload = JSON.stringify({
        event: `entry.${action}`,
        model,
        entry,
    });

    const signature = crypto
        .createHmac("sha256", secret)
        .update(payload)
        .digest("hex");

    try {
        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Strapi-Signature": signature,
            },
            body: payload,
        });
    } catch (error) {
        console.error("Error sending Strapi Webhook:", error);
    }
};

export default {
    async afterCreate(event) {
        const { result } = event;
        await sendWebhook("create", "product", result);
    },

    async afterUpdate(event) {
        const { result } = event;
        await sendWebhook("update", "product", result);
    },

    async afterDelete(event) {
        const { result } = event;
        
        // S3 Cleanup
        if (result?.url) {
            const key = result.url.split(`/${process.env.S3_BUCKET}/`)[1];
            if (key) {
                await s3.send(
                    new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key })
                );
            }
        }

        // DynamoDB Sync
        await sendWebhook("delete", "product", result);
    },
};