import { Injectable } from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { CreatePostDto } from './dto/post.dto';

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
}
