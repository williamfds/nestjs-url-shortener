import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (config: ConfigService) => {
        const getEnv = (key: string): string => {
          const value = config.get<string>(key);
          if (!value) throw new Error(`Missing environment variable: ${key}`);
          return value;
        };

        const host = getEnv('REDIS_HOST');
        const port = parseInt(getEnv('REDIS_PORT'), 10);
        const password = config.get<string>('REDIS_PASSWORD');

        const isLocal = ['localhost', '127.0.0.1', 'redis'].includes(host);

        return new Redis({
          host,
          port,
          password: password || undefined,
          ...(isLocal ? {} : { tls: {} }),
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisProviderModule {}