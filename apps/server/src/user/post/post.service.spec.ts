import { InternalServerErrorException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostRepository } from '../repositories/post.repository';
import { UserRepository } from '../repositories/user.repository';
import { PostService } from './post.service';

describe('PostService', () => {
  let service: PostService;
  let postRepository: PostRepository;
  // let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        PostRepository,
        UserRepository,
        {
          provide: PrismaService,
          useValue: {
            postComments: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
    // prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getPostComments', () => {
    const mockCommentsData = {
      data: [
        {
          postId: 1,
          userId: 1,
          comment: 'Test Comment',
          date: new Date(),
          user: {
            id: 1,
            name: 'John Doe',
            username: 'john.doe',
            email: 'john@example.com',
            password: 'hashedpassword',
          },
        },
      ],
      meta: { cursor: null, hasMore: false },
    };

    it('should return transformed comments data', async () => {
      jest
        .spyOn(postRepository, 'getPostComments')
        .mockResolvedValue(mockCommentsData);

      const result = await service.getPostComments(1, 0, 10);

      expect(result).toEqual(mockCommentsData);
    });

    it('should throw an exception if an error occurs', async () => {
      jest
        .spyOn(postRepository, 'getPostComments')
        .mockRejectedValue(
          new InternalServerErrorException(
            'Erro interno ao buscar comentários do post',
          ),
        );

      await expect(service.getPostComments(1, 0, 10)).rejects.toThrow(
        'Erro interno ao buscar comentários do post',
      );
    });
  });
});
