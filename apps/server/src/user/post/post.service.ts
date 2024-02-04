import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import {
  CreatePostDto,
  PostCommentsResponseDto,
  PostLikesResponseDto,
  PostResponseDto,
} from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}
  async createPost(
    { description }: CreatePostDto,
    postImages: Express.Multer.File[],
    userId: number,
  ) {
    const postUser = await this.postRepository.createPost({
      user: {
        connect: {
          id: userId,
        },
      },
      description,
    });
    await this.postRepository.postImages(postUser.id, postImages);
  }

  async getPost(id: number) {
    const post = await this.postRepository.getPost(id);

    if (!post) {
      throw new NotFoundException('Publicação não encontrada');
    }

    const totalLikes = await this.postRepository.countPostLikes(id);

    const totalComments = await this.postRepository.countPostComments(id);

    const url = `${process.env.APP_URL}/uploads`;

    const postWithUrl = {
      ...post,
      postImages: post.postImages.map((image) => ({
        ...image,
        imageUrl: `${url}/${image.image}`,
      })),
      totalLikes,
      totalComments,
    };

    return new PostResponseDto(postWithUrl);
  }

  async getPostLikes(id: number, cursor?: number, take?: number) {
    const likes = await this.postRepository.getPostLikes(id, cursor, take);

    const transformedData = likes.data.map((like) => {
      return new PostLikesResponseDto(like);
    });

    return { data: transformedData, meta: likes.meta };
  }

  async getPostComments(id: number, cursor?: number, take?: number) {
    const comments = await this.postRepository.getPostComments(
      id,
      cursor,
      take,
    );

    const transformedData = comments.data.map((comment) => {
      return new PostCommentsResponseDto(comment);
    });

    return { data: transformedData, meta: comments.meta };
  }

  async getUserPosts(userId: number) {
    return userId;
  }

  async getAllPosts(cursor?: number, take?: number) {
    const posts = await this.postRepository.getALLposts(cursor, take);

    const url = `${process.env.APP_URL}/uploads`;

    const postsWithUrls = await Promise.all(
      posts.data.map(async (post) => ({
        ...post,
        postImages: post.postImages.map((image) => ({
          ...image,
          imageUrl: `${url}/${image.image}`,
        })),
        totalLikes: await this.postRepository.countPostLikes(post.id),
        totalComments: await this.postRepository.countPostComments(post.id),
      })),
    );

    const transformedData = postsWithUrls.map((post) => {
      return new PostResponseDto(post);
    });

    return { data: transformedData, meta: posts.meta };
  }
}
