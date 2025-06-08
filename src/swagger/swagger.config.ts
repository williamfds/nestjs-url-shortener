import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfigEN = new DocumentBuilder()
  .setTitle('URL Shortener API')
  .setDescription('A simple URL shortener using NestJS, PostgreSQL and Redis')
  .setVersion('1.0')
  .build();

export const swaggerConfigPT = new DocumentBuilder()
  .setTitle('API de Encurtador de URLs')
  .setDescription('Um encurtador de links simples usando NestJS, PostgreSQL e Redis')
  .setVersion('1.0')
  .build();
