import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { DataSource } from 'typeorm';

describe('UrlController (e2e)', () => {
  jest.setTimeout(15000);
  
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    dataSource = moduleFixture.get(DataSource);
  });

  afterAll(async () => {
    const redis = app.get('REDIS_CLIENT');
    await redis.quit();
    await dataSource.destroy();
    await app.close();
  });

  it('POST /shorten should return a shortened URL', async () => {
    const response = await request(app.getHttpServer())
      .post('/shorten')
      .send({ url: 'https://example.com' })
      .expect(201);

    expect(response.body).toHaveProperty('shortUrl');
    expect(typeof response.body.shortUrl).toBe('string');
  });

  it('GET /:shortUrl should redirect to original URL', async () => {
    // Cria um encurtamento primeiro
    const create = await request(app.getHttpServer())
      .post('/shorten')
      .send({ url: 'https://google.com' });

    const slug  = create.body.slug;

    const response = await request(app.getHttpServer())
      .get(`/${slug}`)
      .expect(302);

    expect(response.headers.location).toBe('https://google.com');
  });
});
