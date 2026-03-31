export default ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DB_HOST', '127.0.0.1'),
      port: env.int('DB_PORT', 3306),
      database: env('DB_NAME', 'strapi'),
      user: env('DB_USER', 'root'),
      password: env('DB_PASSWORD', ''),
      ssl: env.bool('DB_SSL', false) ? { rejectUnauthorized: false } : false,
    },
    pool: { min: 2, max: 10 },
  },
});
