import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

interface iConfiguration {
  port: number;
  database: TypeOrmModuleOptions;
  auth: TAuth;
  google: TGoogleOAuth;
  logger: TLogger;
}

export type TAuth = {
  jwt: {
    access: {
      secret: string;
      expiresIn: number;
      cookie: string;
    };
    refresh: {
      secret: string;
      expiresIn: number;
      cookie: string;
    };
  };
  key: string;
};

export type TLogger = {
  pinoHttp: {
    name: string;
    level: string;
    transport: {
      target: string;
      options: {
        colorize: boolean;
        levelFirst: boolean;
        translateTime: string;
        ignore: string;
        singleLine: boolean;
      };
    };
  };
};

export type TGoogleOAuth = {
  clientId: string;
  clientSecret: string;
  host: string;
  scopes: string;
  userInfoUri: string;
};

const configuration: iConfiguration = {
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
      access: {
        secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
        expiresIn: 60 * 60,
        cookie: 'access-token',
      },
      refresh: {
        secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
        expiresIn: 30 * 24 * 60 * 60,
        cookie: 'refresh-token',
      },
    },
    key: process.env.AUTH_KEY,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    host: 'https://accounts.google.com',
    scopes: 'openid profile email',
    userInfoUri: `https://www.googleapis.com/oauth2/v3/userinfo`,
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
};

export default () => configuration;
