import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShortenerService } from './shortener.service';
import { ShortenerController } from './shortener.controller';
import { Link } from './entities/link.entity';
import { RedisProviderModule } from '../redis/redis.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Link]),
    RedisProviderModule,
  ],
  controllers: [ShortenerController],
  providers: [ShortenerService],
})
export class ShortenerModule {}
