import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { PostRepository } from '../repositories/post.repository';
import { UserRepository } from '../repositories/user.repository';
import { CreateCommentDto } from './dto/post.dto';
import { PostService } from './post.service';

const mockUserReturnData = {
  id: 1,
  name: 'john doe',
  username: 'johnjohn',
  email: 'john@gmail.com',
  password: 'kskhskhdksjdow',
  profilePicture: 'img1.png',
  bio: 'hello world!',
};

const mockPostReturnData = {
  id: 1,
  userId: 1,
  description: 'nice',
  date: new Date(),
};

const mockCommentReturnData = {
  id: 1,
  postId: 1,
  comment: 'Test Comment',
  date: new Date(),
  userId: 1,
};

const mockLikeReturnData = {
  id: 1,
  postId: 1,
  date: new Date(),
  userId: 1,
};

const mockCreateCommentData: CreateCommentDto = {
  comment: 'Test Comment',
};

describe('PostService', () => {
  let service: PostService;
  let postRepository: PostRepository;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        PostRepository,
        UserRepository,
        PrismaService,
        {
          provide: UserRepository,
          useValue: {
            findUserById: jest.fn().mockReturnValue(mockUserReturnData),
          },
        },
        {
          provide: PostRepository,
          useValue: {
            findPostById: jest.fn().mockResolvedValue(mockPostReturnData),
            findCommentByUserId: jest.fn().mockReturnValue(null),
            findLikeByUserId: jest.fn().mockReturnValue(null),
            getPostComments: jest.fn(),
            createComment: jest.fn(),
            createLike: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
    userRepository = module.get<UserRepository>(UserRepository);
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

  describe('createComment', () => {
    it('should create a comment', async () => {
      jest
        .spyOn(postRepository, 'createComment')
        .mockResolvedValue(mockCommentReturnData);

      const result = await service.createComment(1, 1, mockCreateCommentData);

      expect(postRepository.findPostById).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserById).toHaveBeenCalledTimes(1);
      expect(postRepository.createComment).toHaveBeenCalledTimes(1);
      expect(postRepository.createComment).toHaveBeenCalledWith({
        ...mockCreateCommentData,
        user: {
          connect: {
            id: 1,
          },
        },
        post: {
          connect: {
            id: 1,
          },
        },
      });

      expect(result).toEqual({ id: mockCommentReturnData.id });
    });

    it('should throw an exception if user has already commented', async () => {
      jest
        .spyOn(postRepository, 'createComment')
        .mockRejectedValue(
          new ConflictException(
            'Não é possível fazer mais de um comentário por postagem',
          ),
        );

      jest
        .spyOn(postRepository, 'findCommentByUserId')
        .mockResolvedValue(mockCommentReturnData);

      await expect(
        service.createComment(1, 1, mockCreateCommentData),
      ).rejects.toThrow(
        new ConflictException(
          'Não é possível fazer mais de um comentário por postagem',
        ),
      );
    });

    it('should throw an exception if an error occurs', async () => {
      jest
        .spyOn(postRepository, 'createComment')
        .mockRejectedValue(
          new InternalServerErrorException(
            'Erro interno ao criar novo comentário',
          ),
        );

      await expect(
        service.createComment(1, 1, mockCreateCommentData),
      ).rejects.toThrow(
        new InternalServerErrorException(
          'Erro interno ao criar novo comentário',
        ),
      );
    });
  });

  describe('createLike', () => {
    it('should create a like', async () => {
      jest
        .spyOn(postRepository, 'createLike')
        .mockResolvedValue(mockLikeReturnData);

      const result = await service.createLike(1, 1);

      expect(postRepository.findPostById).toHaveBeenCalledTimes(1);
      expect(userRepository.findUserById).toHaveBeenCalledTimes(1);
      expect(postRepository.createLike).toHaveBeenCalledTimes(1);
      expect(postRepository.createLike).toHaveBeenCalledWith({
        user: {
          connect: {
            id: 1,
          },
        },
        post: {
          connect: {
            id: 1,
          },
        },
      });
      expect(result).toEqual({ id: mockLikeReturnData.id });
    });

    it('should throw an exception if user has already liked', async () => {
      jest
        .spyOn(postRepository, 'createLike')
        .mockRejectedValue(
          new ConflictException(
            'Não é possível dar mais de um like por postagem',
          ),
        );

      jest
        .spyOn(postRepository, 'findLikeByUserId')
        .mockResolvedValue(mockLikeReturnData);

      await expect(service.createLike(1, 1)).rejects.toThrow(
        new ConflictException(
          'Não é possível dar mais de um like por postagem',
        ),
      );
    });

    it('should throw an exception if an error occurs', async () => {
      jest
        .spyOn(postRepository, 'createLike')
        .mockRejectedValue(
          new InternalServerErrorException('Erro interno ao dar like'),
        );

      await expect(
        postRepository.createLike({
          user: {
            connect: {
              id: 1,
            },
          },
          post: {
            connect: {
              id: 1,
            },
          },
        }),
      ).rejects.toThrow(
        new InternalServerErrorException('Erro interno ao dar like'),
      );
    });
  });
});

describe('PostRepository', () => {
  let postRepository: PostRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostRepository,
        {
          provide: PrismaService,
          useValue: {
            postComments: {
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
        {
          provide: PostRepository,
          useValue: {
            findPostById: jest.fn().mockReturnValue(mockPostReturnData),
            findCommentByUserId: jest.fn().mockReturnValue(null),
            getPostComments: jest.fn(),
            createComment: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    postRepository = module.get<PostRepository>(PostRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createComment', () => {
    it('should call create method of the PrismaService', async () => {
      jest
        .spyOn(prismaService.postComments, 'create')
        .mockResolvedValueOnce(mockCommentReturnData);

      const result = await postRepository.createComment({
        ...mockCreateCommentData,
        user: {
          connect: {
            id: 1,
          },
        },
        post: {
          connect: {
            id: 1,
          },
        },
      });

      console.log(result);

      // expect(prismaService.postComments.create).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockCommentReturnData);
    });
  });
});
