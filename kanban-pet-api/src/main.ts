import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { LoggerErrorInterceptor, Logger as PinoLogger } from 'nestjs-pino';
import {
  ClassSerializerInterceptor,
  RequestMethod,
  VersioningType,
} from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './app.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector)),
    new LoggerErrorInterceptor(),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useLogger(app.get(PinoLogger));
  app.enableCors({ credentials: true, origin: 'http://localhost:3000' });
  app.use(cookieParser());
  app.flushLogs();

  app
    .enableVersioning({
      type: VersioningType.URI,
    })
    .setGlobalPrefix(`/api`, {
      exclude: [{ path: 'health', method: RequestMethod.GET }],
    });

  const config = new DocumentBuilder()
    .setTitle('Kanban Api')
    .setDescription('The Kanban API description')
    .addBearerAuth(
      {
        description: `Please enter token in following format: Bearer [token]`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .addApiKey(
      { type: 'apiKey', name: 'x-auth-key', in: 'header' },
      'x-auth-key',
    )
    .build();

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  };

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/:version/docs`, app, document, customOptions);

  await app.listen(process.env.PORT);

  console.log(`Server is running at http://localhost:${process.env.PORT}`);
}
bootstrap();
