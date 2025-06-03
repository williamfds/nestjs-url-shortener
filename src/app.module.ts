import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortenerModule } from './shortener/shortener.module';
import { RedisProviderModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const host = config.get<string>('DATABASE_HOST');
        const port = config.get<string>('DATABASE_PORT');
        const user = config.get<string>('DATABASE_USER');
        const pass = config.get<string>('DATABASE_PASS');
        const dbName = config.get<string>('DATABASE_NAME');
        return {
          type: 'postgres',
          host: host!,
          port: +port!,
          username: user!,
          password: pass!,
          database: dbName!,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),

    RedisProviderModule,
    ShortenerModule,
  ],
})
export class AppModule {}
