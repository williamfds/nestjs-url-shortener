import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfigEN, swaggerConfigPT } from './swagger/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const documentEN = SwaggerModule.createDocument(app, swaggerConfigEN);
  SwaggerModule.setup('api', app, documentEN);

  const documentPT = SwaggerModule.createDocument(app, swaggerConfigPT);
  SwaggerModule.setup('api-pt', app, documentPT);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`✅ App on http://localhost:${port}`);
  console.log(`🇺🇸 Swagger EN: http://localhost:${port}/api`);
  console.log(`🇧🇷 Swagger PT: http://localhost:${port}/api-pt`);
}
bootstrap();