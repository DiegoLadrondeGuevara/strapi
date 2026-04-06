export default ({ env }) => [
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
            '*.cloudfront.net',
            '*.amazonaws.com',
            env('CLOUDFRONT_URL', '').replace('https://', '')
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'dl.airtable.com',
            '*.cloudfront.net',
            '*.amazonaws.com',
            env('CLOUDFRONT_URL', '').replace('https://', '')
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
      origin: [
        'http://localhost:3000',
        'http://localhost:1337',
        'https://i6r407vake.execute-api.us-east-2.amazonaws.com', // API Gateway
        env('FRONTEND_URL', '*') // Frontend placeholder
      ]
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
