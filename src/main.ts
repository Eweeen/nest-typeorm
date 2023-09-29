import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';
import helmet from 'helmet';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Pipe to transform variable with the good type
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      skipUndefinedProperties: true,
    }),
  );

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Security
  app.enableCors({ origin: process.env.APP_URL, credentials: true });
  app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
  app.disable('x-powered-by');

  // Disable swagger in production
  if (process.env.NODE_ENV !== 'production') {
    // Swagger
    const config = new DocumentBuilder()
      .setTitle('Swagger NestJS & TypeORM Template')
      .setDescription('API Design with NestJS')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('/api-docs', app, document, {
      customSiteTitle: 'NestJS API',
    });
  }

  // Use HttpExceptionFilter to handle exceptions globally
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(process.env.PORT);
}
bootstrap();
