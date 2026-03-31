export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        s3Options: {
          region: env('AWS_REGION', 'us-east-2'),
          params: {
            Bucket: env('S3_BUCKET', 'dulceruth-assets'),
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
