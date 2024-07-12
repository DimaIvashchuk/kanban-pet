export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
    type: 'postgres',
    autoLoadEntities: true,
    synchronize: true,
    entities: ['../modules/**/*.entity.ts'],
    migrations: ['./dist/migrations/*.js', './migrations/*.js'],
    maxQueryExecutionTime: 1000,
  },
  auth: {
    jwt: {
      accessSecret: process.env.AUTH_REFRESH_TOKEN_SECRET,
      accessExpiresIn: 60 * 60,
      refreshSecret: process.env.AUTH_ACCESS_TOKEN_SECRET,
      refreshExpiresIn: 24 * 60 * 60,
    },
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    host: 'https://accounts.google.com',
    scopes: 'openid profile email',
  },
  logger: {
    pinoHttp: {
      name: 'kanban-api',
      level: process.env.LOG_LEVEL ?? 'debug',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true,
          levelFirst: true,
          translateTime: 'SYS:standard',
          ignore: 'req.headers,res.headers',
          singleLine: true,
        },
      },
    },
  },
});
