import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export default {
    async beforeDelete(event) {
        const { result } = event;

        if (result?.url) {
            // Extrae el key de S3 desde la URL
            const key = result.url.split(`/${process.env.S3_BUCKET}/`)[1];
            if (key) {
                await s3.send(
                    new DeleteObjectCommand({ Bucket: process.env.S3_BUCKET, Key: key })
                );
            }
        }
    },
};