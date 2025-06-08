import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortenerModule } from './shortener/shortener.module';
import { RedisProviderModule } from './redis/redis.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 10,
        },
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const getEnv = (key: string): string => {
          const value = config.get<string>(key);
          if (!value) throw new Error(`Missing environment variable: ${key}`);
          return value;
        };

        const host = getEnv('DATABASE_HOST');
        const port = parseInt(getEnv('DATABASE_PORT'), 10);
        const user = getEnv('DATABASE_USER');
        const pass = getEnv('DATABASE_PASS');
        const dbName = getEnv('DATABASE_NAME');

        const isLocal = ['localhost', '127.0.0.1', 'postgres'].includes(host);

        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password: pass,
          database: dbName,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          ...(isLocal ? {} : { ssl: { rejectUnauthorized: false } }),
        };
      },
      inject: [ConfigService],
    }),
    RedisProviderModule,
    ShortenerModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}