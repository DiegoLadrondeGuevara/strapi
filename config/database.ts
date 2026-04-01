export default ({ env }) => ({
  connection: {
    client: env('DATABASE_CLIENT', 'mysql'),
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 3306),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', false) || env('DATABASE_SSL') === 'true'
        ? { rejectUnauthorized: false } // Required for AWS RDS without a truststore
        : false,
    },
    pool: { min: 2, max: 10 },
  },
});