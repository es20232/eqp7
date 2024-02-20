import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Test, TestingModule } from '@nestjs/testing';
import { PostImages, User, UserPost } from '@prisma/client';
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
  let image: PostImages;
  let user: User;
  let token: string;
  const testImage = `${__dirname}/test-files/test.jpg`;
  const testImageFails = `${__dirname}/test-files/test-fail.svg`;

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

    await app.getHttpServer().listen(0);

    await app.init();

    ({ post, image, user } = await prismaService.$transaction(
      async (prisma) => {
        const user = await prisma.user.create({
          data: {
            email: 'test@test.com',
            name: 'john doe',
            password: await bcrypt.hash('Test123', 10),
            username: 'johnjohn',
          },
        });

        const post = await prisma.userPost.create({
          data: {
            description: 'nice day',
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        const image = await prisma.postImages.create({
          data: {
            image: 'img1.png',
            post: {
              connect: {
                id: post.id,
              },
            },
          },
        });
        return { post, image, user };
      },
    ));
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestExpressApplication>();

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
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  describe('POST /auth/sign-in', () => {
    it('should log-in an user', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post('/auth/sign-in')
        .send({
          user: user.email,
          password: 'Test123',
        });

      expect(status).toBe(201);
      expect(body.user.email).toEqual(user.email);

      token = body.accessToken.value;
    });
  });

  describe('GET /post:id', () => {
    it('should return a post', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`/post/${post.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(200);
      expect(body).toEqual({
        id: post.id,
        description: post.description,
        date: format(post.date, 'dd/MM/yyyy'),
        postImages: [
          {
            id: image.id,
            image: image.image,
            imageUrl: `${uploadUrl}/${image.image}`,
          },
        ],
        user: {
          id: post.userId,
          email: user.email,
          name: user.name,
          username: user.username,
          bio: null,
        },
        totalComments: 0,
        totalLikes: 0,
        totalDeslikes: 0,
        hasUserLiked: false,
        hasUserCommented: false,
        hasUserDesliked: false,
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

    it('should not create a post with an invalid image format', async () => {
      await request(app.getHttpServer())
        .post('/post')
        .set('Authorization', `Bearer ${token}`)
        .attach('images', testImageFails)
        .field('description', 'hello world')
        .expect(HttpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should not let a not signed-in user create a post', async () => {
      await request(app.getHttpServer())
        .post('/post')
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('GET /post', () => {
    it('should return all posts', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get('/post')
        .set('Authorization', `Bearer ${token}`)
        .query({
          cursor: 1,
          take: 10,
        });

      expect(status).toBe(200);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('meta');
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data[0]).toMatchObject({
        id: expect.any(Number),
        description: expect.any(String),
        date: expect.any(String),
        postImages: [
          {
            id: expect.any(Number),
            image: expect.any(String),
            imageUrl: expect.any(String),
          },
        ],
        user: {
          id: expect.any(Number),
          name: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          bio: null,
        },
        totalLikes: expect.any(Number),
        totalDeslikes: expect.any(Number),
        totalComments: expect.any(Number),
        hasUserLiked: expect.any(Boolean),
        hasUserCommented: expect.any(Boolean),
        hasUserDesliked: expect.any(Boolean),
      });
      expect(body.meta).toMatchObject({
        cursor: expect.any(Number),
        hasMore: expect.any(Boolean),
      });
    });
  });

  describe('POST /post/:id/comment', () => {
    it('should create a comment', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(`/post/${post.id}/comment`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          comment: 'that is cool',
        });

      expect(status).toBe(201);
      expect(body.id).toBeGreaterThanOrEqual(0);
    });

    it('should not let user comments twice', async () => {
      await request(app.getHttpServer())
        .post(`/post/${post.id}/comment`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          comment: 'good',
        })
        .expect(HttpStatus.CONFLICT);
    });
  });

  describe('POST /post/:id/like', () => {
    it('should create a like', async () => {
      const { status, body } = await request(app.getHttpServer())
        .post(`/post/${post.id}/like`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(201);
      expect(body.id).toBeGreaterThanOrEqual(0);
    });

    it('should not let user likes twice', async () => {
      await request(app.getHttpServer())
        .post(`/post/${post.id}/like`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.CONFLICT);
    });

    it('should not let a not signed-in user likes a post', async () => {
      await request(app.getHttpServer())
        .post(`/post/${post.id}/like`)
        .expect(HttpStatus.FORBIDDEN);
    });
  });

  describe('GET /post/:id/comments', () => {
    it('should return all the comments from a post', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`/post/${post.id}/comments`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(200);

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('meta');
      expect(body.data[0]).toMatchObject({
        comment: expect.any(String),
        date: expect.any(String),
        user: {
          id: expect.any(Number),
          name: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          bio: null,
        },
      });
      expect(body.meta).toMatchObject({
        cursor: expect.any(Number),
        hasMore: expect.any(Boolean),
      });
    });
  });

  describe('GET /post/:id/likes', () => {
    it('should return all the likes from a post', async () => {
      const { status, body } = await request(app.getHttpServer())
        .get(`/post/${post.id}/likes`)
        .set('Authorization', `Bearer ${token}`);

      expect(status).toBe(200);

      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('meta');
      expect(body.data[0]).toMatchObject({
        date: expect.any(String),
        user: {
          id: expect.any(Number),
          name: expect.any(String),
          username: expect.any(String),
          email: expect.any(String),
          bio: null,
        },
      });
      expect(body.meta).toMatchObject({
        cursor: expect.any(Number),
        hasMore: expect.any(Boolean),
      });
    });
  });
});
