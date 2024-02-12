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
import { CreateCommentDto, PostResponseDto } from './dto/post.dto';
import { PostService } from './post.service';

const url = `${process.env.APP_URL}/uploads`;

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

const mockPaginatedCommentsData = {
  data: [
    {
      postId: 1,
      userId: 1,
      comment: 'Test Comment',
      date: new Date(),
      user: { ...mockUserReturnData },
    },
  ],
  meta: { cursor: null, hasMore: false },
};

const mockPaginatedLikesData = {
  data: [
    {
      postId: 1,
      userId: 1,
      date: new Date(),
      user: { ...mockUserReturnData },
    },
  ],
  meta: { cursor: null, hasMore: false },
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

const mockGetPostData = {
  postImages: [
    {
      id: 1,
      postId: 1,
      image: 'img1.png',
    },
  ],
  user: { ...mockUserReturnData },
  ...mockPostReturnData,
};

const mockPaginatedPostsData = {
  data: [
    new PostResponseDto({
      ...mockGetPostData,
      postImages: [
        {
          postId: 1,
          image: 'img1.png',
          imageUrl: `${url}/img1.png`,
        },
      ],
    }),
  ],
  meta: { cursor: null, hasMore: false },
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
            countPostLikes: jest.fn().mockReturnValue(1),
            countPostComments: jest.fn().mockResolvedValue(1),
            getPostComments: jest.fn(),
            getPostLikes: jest.fn(),
            createComment: jest.fn(),
            createLike: jest.fn(),
            getPost: jest.fn(),
            getAllPosts: jest.fn(),
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
    it('should return paginated comments data', async () => {
      jest
        .spyOn(postRepository, 'getPostComments')
        .mockResolvedValue(mockPaginatedCommentsData);

      const result = await service.getPostComments(1, 0, 10);

      expect(result).toEqual(mockPaginatedCommentsData);
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
        new InternalServerErrorException(
          'Erro interno ao buscar comentários do post',
        ),
      );
    });
  });

  describe('getPostLikes', () => {
    it('should return paginated likes data', async () => {
      jest
        .spyOn(postRepository, 'getPostLikes')
        .mockResolvedValue(mockPaginatedLikesData);

      const result = await service.getPostLikes(1, 0, 10);

      expect(result).toEqual(mockPaginatedLikesData);
    });

    it('should throw an exception if an error occurs', async () => {
      jest
        .spyOn(postRepository, 'getPostLikes')
        .mockRejectedValue(
          new InternalServerErrorException(
            'Erro interno ao buscar likes do post',
          ),
        );

      await expect(service.getPostLikes(1, 0, 10)).rejects.toThrow(
        new InternalServerErrorException(
          'Erro interno ao buscar likes do post',
        ),
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

  describe('getPost', () => {
    it('should return transformed post data', async () => {
      jest.spyOn(postRepository, 'getPost').mockResolvedValue(mockGetPostData);

      const result = await service.getPost(1);

      expect(postRepository.countPostLikes).toHaveBeenCalled();
      expect(postRepository.countPostComments).toHaveBeenCalled();
      expect(result).toEqual({
        ...mockGetPostData,
        postImages: [
          {
            ...mockGetPostData.postImages[0],
            imageUrl: `${url}/img1.png`,
          },
        ],
        totalComments: 1,
        totalLikes: 1,
      });
    });
  });

  it('should throw an exception if an error occurs', async () => {
    jest
      .spyOn(postRepository, 'getPost')
      .mockRejectedValue(
        new InternalServerErrorException('Erro interno ao buscar post'),
      );

    await expect(service.getPost(1)).rejects.toThrow(
      new InternalServerErrorException('Erro interno ao buscar post'),
    );
  });

  describe('getAllPosts', () => {
    it('should return all posts paginated', async () => {
      jest
        .spyOn(postRepository, 'getAllPosts')
        .mockResolvedValue(mockPaginatedPostsData);

      const result = await service.getAllPosts(0, 10);

      expect(result).toEqual({
        ...mockPaginatedPostsData,
        data: [
          {
            ...mockPaginatedPostsData.data[0],
            totalLikes: 1,
            totalComments: 1,
          },
        ],
      });
    });

    it('should throw an exception if an error occurs', async () => {
      jest
        .spyOn(postRepository, 'getAllPosts')
        .mockRejectedValue(
          new InternalServerErrorException('Erro interno ao buscar posts'),
        );

      await expect(service.getAllPosts(0, 10)).rejects.toThrow(
        new InternalServerErrorException('Erro interno ao buscar posts'),
      );
    });
  });
});
