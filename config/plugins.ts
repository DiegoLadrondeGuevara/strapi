export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          },
          region: env('AWS_REGION', 'us-east-2'),
        },
        params: {
          Bucket: env('S3_BUCKET'),
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