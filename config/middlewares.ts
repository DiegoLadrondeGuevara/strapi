export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'", 
            'data:', 
            'blob:', 
            'dl.airtable.com', 
            process.env.CLOUDFRONT_URL ? process.env.CLOUDFRONT_URL.replace('https://', '') : `${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
          ],
          'media-src': [
            "'self'", 
            'data:', 
            'blob:', 
            'dl.airtable.com', 
            process.env.CLOUDFRONT_URL ? process.env.CLOUDFRONT_URL.replace('https://', '') : `${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:3000', 'http://localhost:1337', process.env.PUBLIC_URL || '*'] // Restrict to frontends
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
