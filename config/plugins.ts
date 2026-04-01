export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        baseUrl: env('CLOUDFRONT_URL'), // Ensures Strapi returns CloudFront URLs instead of raw S3 URLs
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_ACCESS_SECRET_KEY'),
          },
          region: env('AWS_REGION', 'us-east-2'),
          params: {
            Bucket: env('S3_BUCKET', 'dulceruth-assets'),
            // Supported MIME types like JSON (Lottie) or WebP automatically inherit 
            // the contentType mapped by Strapi's internal mime parser.
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});