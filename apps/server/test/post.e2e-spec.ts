import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { UserPost } from '@prisma/client';
import { format } from 'date-fns';
import { AppModule } from 'src/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import * as request from 'supertest';

export const uploadUrl = `${process.env.APP_URL}/uploads`;

describe('PostController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let post: UserPost;

  beforeEach(async () => {
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
                password: 'kajsakswd',
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
            connectOrCreate: {
              create: {
                description: 'nice day',
                userId: 1,
              },
              where: {
                id: 1,
              },
            },
          },
        },
      });

      return post;
    });
  });

  describe('GET /post:id', () => {
    it('should return a post', async () => {
      const { status, body } = await request(app.getHttpServer()).get(
        `/post/${post.id}`,
      );

      console.log(body);

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
      });
    });
  });
});
