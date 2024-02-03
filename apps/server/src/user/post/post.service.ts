import { Injectable, NotFoundException } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto, PostResponseDto } from './dto/post.dto';

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

  async getPost(id: number, cursor?: number, take?: number) {
    const post = await this.postRepository.getPost(id);

    if (!post) {
      throw new NotFoundException('Publicação não encontrada');
    }

    const postComments = await this.postRepository.getPostComments(
      id,
      cursor,
      take,
    );

    const url = `${process.env.APP_URL}/uploads`;

    const imagesWithUrls = post.postImages.map((image) => ({
      ...image,
      imageUrl: `${url}/${image.image}`,
    }));

    const postWithUrl = {
      ...post,
      postImages: imagesWithUrls,
      postComments,
    };

    return new PostResponseDto(postWithUrl);
  }

  async getUserPosts(userId: number) {
    const posts = await this.postRepository.getUserPosts(userId);

    return posts;
  }
}
