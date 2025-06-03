import {
  Injectable,
  NotFoundException,
  Inject,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { Link } from './entities/link.entity';
import { CreateShortDto } from './dto/create-short.dto';

@Injectable()
export class ShortenerService {
  private readonly logger = new Logger(ShortenerService.name);
  private readonly HITS_FLUSH_THRESHOLD = 5;

  constructor(
    @InjectRepository(Link)
    private readonly linkRepo: Repository<Link>,

    @Inject('REDIS_CLIENT')
    private readonly redisClient: Redis,

    private readonly config: ConfigService,
  ) {}

  private generateSlug(length = 6): string {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < length; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return slug;
  }

  async createShort(
    createDto: CreateShortDto,
  ): Promise<{ slug: string; shortUrl: string }> {
    const url = createDto.url.trim();
    const baseDomain = this.config.get<string>('APP_DOMAIN');

    const existingByUrl = await this.linkRepo.findOne({ where: { originalUrl: url } });
    if (existingByUrl) {
      return {
        slug: existingByUrl.slug,
        shortUrl: `${baseDomain}/${existingByUrl.slug}`,
      };
    }

    let slug: string;
    let existing: Link | null;
    let attempts = 0;
    const MAX_ATTEMPTS = 5;

    do {
      if (++attempts > MAX_ATTEMPTS) {
        throw new Error('Unable to generate a unique slug. Please try again.');
      }

      slug = this.generateSlug(6);
      existing = await this.linkRepo.findOne({ where: { slug } });
    } while (existing);

    const link = this.linkRepo.create({ slug, originalUrl: url });
    const savedLink = await this.linkRepo.save(link);

    await this.redisClient.set(`link:${slug}`, url);

    return {
      slug: savedLink.slug,
      shortUrl: `${baseDomain}/${savedLink.slug}`,
    };
  }


  async getOriginalUrl(slug: string): Promise<string> {
    const cacheKey = `link:${slug}`;
    const cachedUrl = await this.redisClient.get(cacheKey);
    if (cachedUrl) {
      return cachedUrl;
    }

    const linkEntity = await this.linkRepo.findOne({ where: { slug } });
    if (!linkEntity) {
      throw new NotFoundException('Short URL not found');
    }

    await this.redisClient.set(cacheKey, linkEntity.originalUrl);
    return linkEntity.originalUrl;
  }

  async incrementHits(slug: string): Promise<void> {
    const hitsKey = `hits:${slug}`;
    const currentHits = await this.redisClient.incr(hitsKey);

    if (currentHits >= this.HITS_FLUSH_THRESHOLD) {
      await this.redisClient.set(hitsKey, '0');

      await this.linkRepo
        .createQueryBuilder()
        .update(Link)
        .set({ hits: () => `"hits" + ${currentHits}` })
        .where('slug = :slug', { slug })
        .execute();

      this.logger.log(
        `Flushed ${currentHits} hits for slug "${slug}" to Postgres`,
      );
    }
  }

  async getStats(
    slug: string,
  ): Promise<Pick<Link, 'originalUrl' | 'slug' | 'hits' | 'createdAt'>> {
    const linkEntity = await this.linkRepo.findOne({ where: { slug } });
    if (!linkEntity) {
      throw new NotFoundException('Short URL not found');
    }

    const hitsKey = `hits:${slug}`;
    const redisHits = parseInt((await this.redisClient.get(hitsKey)) || '0', 10);
    return {
      originalUrl: linkEntity.originalUrl,
      slug: linkEntity.slug,
      hits: linkEntity.hits + redisHits,
      createdAt: linkEntity.createdAt,
    };
  }

  async updateSlug(oldSlug: string, newSlug: string): Promise<void> {
    const existing = await this.linkRepo.findOne({ where: { slug: newSlug } });
    if (existing) throw new BadRequestException('Slug already in use');

    const link = await this.linkRepo.findOne({ where: { slug: oldSlug } });
    if (!link) throw new NotFoundException('Original slug not found');

    link.slug = newSlug;
    await this.linkRepo.save(link);
  }

  async deleteSlug(slug: string): Promise<void> {
    const link = await this.linkRepo.findOne({ where: { slug } });
    if (!link) throw new NotFoundException('Slug not found');
    await this.linkRepo.remove(link);
  }

}