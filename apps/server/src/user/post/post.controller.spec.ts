import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { AuthGuard } from 'src/guards/auth.guard';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto, PostResponseDto } from './dto/post.dto';
import { PostController } from './post.controller';
import { PostService } from './post.service';

export const uploadUrl = `${process.env.APP_URL}/uploads`;

export const mockCreateCommentData: CreateCommentDto = {
  comment: 'Test Comment',
};

export const mockUserReturnData = {
  id: 1,
  name: 'john doe',
  username: 'johnjohn',
  email: 'john@gmail.com',
  password: 'kskhskhdksjdow',
  profilePicture: 'img1.png',
  bio: 'hello world!',
};

export const mockPaginatedCommentsData = {
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

export const mockPaginatedLikesData = {
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

export const mockPostReturnData = {
  id: 1,
  userId: 1,
  description: 'nice',
  date: new Date(),
};

export const mockGetPostData = {
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

export const mockPaginatedPostsData = {
  data: [
    new PostResponseDto({
      ...mockGetPostData,
      postImages: [
        {
          postId: 1,
          image: 'img1.png',
          imageUrl: `${uploadUrl}/img1.png`,
        },
      ],
    }),
  ],
  meta: { cursor: null, hasMore: false },
};

describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        PrismaService,
        {
          provide: PostService,
          useValue: {
            createComment: jest.fn(),
            getPost: jest.fn(),
            getAllPosts: jest.fn(),
            getPostLikes: jest.fn(),
            getPostComments: jest.fn(),
            createLike: jest.fn(),
          },
        },
        {
          provide: AuthGuard,
          useValue: jest.fn().mockImplementation(() => true), // do anything in the function, just so that the function is mocked
        },
      ],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createComment', () => {
    it('should create a comment', async () => {
      jest.spyOn(postService, 'createComment').mockResolvedValue({ id: 1 });

      const result = await controller.createComment(
        mockCreateCommentData,
        1,
        1,
      );

      expect(postService.createComment).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('createLike', () => {
    it('should create a like', async () => {
      jest.spyOn(postService, 'createLike').mockResolvedValue({
        id: 1,
      });

      const result = await controller.createLike(1, 1);

      expect(postService.createLike).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 1 });
    });
  });

  describe('getPostComments', () => {
    it('should return paginated comments data', async () => {
      jest
        .spyOn(postService, 'getPostComments')
        .mockResolvedValue(mockPaginatedCommentsData);

      const result = await controller.getPostComments(1, {
        cursor: 0,
        take: 10,
      });

      expect(postService.getPostComments).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaginatedCommentsData);
    });
  });

  describe('getPostLikes', () => {
    it('should return paginated likes data', async () => {
      jest
        .spyOn(postService, 'getPostLikes')
        .mockResolvedValue(mockPaginatedLikesData);

      const result = await controller.getPostLikes(1, { cursor: 0, take: 10 });

      expect(postService.getPostLikes).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockPaginatedLikesData);
    });
  });

  describe('getPost', () => {
    it('should return transformed post data', async () => {
      jest.spyOn(postService, 'getPost').mockResolvedValue({
        ...mockGetPostData,
        postImages: [
          {
            ...mockGetPostData.postImages[0],
            imageUrl: `${uploadUrl}/img1.png`,
          },
        ],
        totalComments: 1,
        totalLikes: 1,
      });

      const result = await controller.getPost(1);

      expect(result).toEqual({
        ...mockGetPostData,
        postImages: [
          {
            ...mockGetPostData.postImages[0],
            imageUrl: `${uploadUrl}/img1.png`,
          },
        ],
        totalComments: 1,
        totalLikes: 1,
      });
    });
  });

  describe('getAllPosts', () => {
    it('should return all posts paginated', async () => {
      jest.spyOn(postService, 'getAllPosts').mockResolvedValue({
        ...mockPaginatedPostsData,
        data: [
          {
            ...mockPaginatedPostsData.data[0],
            totalLikes: 1,
            totalComments: 1,
          },
        ],
      });

      const result = await controller.getAllPosts({ cursor: 0, take: 10 });

      expect(postService.getAllPosts).toHaveBeenCalledTimes(1);
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
  });
});
