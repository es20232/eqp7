import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { UserPost } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { format } from 'date-fns';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';

export const uploadUrl = `${process.env.APP_URL}/uploads`;

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let post: UserPost;
  let token: string;
  const testImage = `${__dirname}/test-files/test.jpg`;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

    prismaService = app.get<PrismaService>(PrismaService);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );

    await app.init();

    post = await prismaService.$transaction(async (prisma) => {
      const post = await prisma.userPost.create({
        data: {
          description: 'nice day',
          user: {
            connectOrCreate: {
              create: {
                email: 'test@test.com',
                name: 'john doe',
                password: await bcrypt.hash('Test123', 10),
                username: 'johnjohn',
              },
              where: {
                id: 1,
              },
            },
          },
        },
      });

      await prisma.postImages.create({
        data: {
          image: 'img1.png',
          post: {
            connect: {
              id: post.id,
            },
          },
        },
      });

      return post;
    });
  });

  describe('POST /auth/sign-in', () => {
    it('should log-in an user', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          user: 'test@test.com',
          password: 'Test123',
        });

      expect(status).toBe(201);
      expect(body.user.email).toEqual('test@test.com');

      token = body.accessToken.value;
    });
  });

  describe('GET /post:id', () => {
    it('should return a post', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/post/${post.id}`,
      );

      expect(status).toBe(200);
      expect(body).toEqual({
        id: post.id,
        description: post.description,
        date: format(post.date, 'dd/MM/yyyy'),
        postImages: [
          {
            id: 1,
            image: 'img1.png',
            imageUrl: `${uploadUrl}/img1.png`,
          },
        ],
        user: {
          id: 1,
          email: 'test@test.com',
          name: 'john doe',
          username: 'johnjohn',
          bio: null,
        },
        totalComments: 0,
        totalLikes: 0,
        totalDeslikes: 0,
      });
    });
  });

  describe('POST /post', () => {
    it('should create a post', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/post')
        .set('Authorization', `Bearer ${token}`)
        .attach('images', testImage)
        .field('description', 'hello world');

      expect(status).toBe(201);
      expect(body.id).toBeGreaterThanOrEqual(0);
    });
  });
});
