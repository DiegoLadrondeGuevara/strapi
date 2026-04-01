export default ({ env }) => ({
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        baseUrl: env('CLOUDFRONT_URL'),
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            // CORRECCIÓN: El nombre debe coincidir EXACTO con tu .env
            secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
          },
          region: env('AWS_REGION', 'us-east-2'),
          forcePathStyle: true,
          // Eliminamos signatureVersion 'v4' si usas Strapi 5 + SDK v3 de AWS, 
          // ya que viene por defecto y a veces causa conflictos si se fuerza.
        },
        params: {
          Bucket: env('S3_BUCKET', 'dulceruth-assets'),
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