import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule } from '@nestjs/config';
import Redis from 'ioredis';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (config: ConfigService) => {
        return new Redis({
          host: config.get('REDIS_HOST'),
          port: +config.get('REDIS_PORT'),
          password: config.get('REDIS_PASSWORD'),
          tls: {},
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CLIENT'],
})
export class RedisProviderModule {}