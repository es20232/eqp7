import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import paginator from 'src/utils/paginator';
import {
  PostCommentsResponseDto,
  PostLikesResponseDto,
  PostResponseDto,
} from '../post/dto/post.dto';

type TransactionFunction<T> = (prisma: PrismaService) => Promise<T>;

@Injectable()
export class PostRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(data: Prisma.UserPostCreateInput) {
    try {
      return this.prismaService.userPost.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao criar post',
        error,
      );
    }
  }

  async postImages(postId: number, profilePictures: Express.Multer.File[]) {
    try {
      return Promise.all(
        profilePictures.map((picture) =>
          this.prismaService.postImages.create({
            data: {
              postId: postId,
              image: picture.filename,
            },
          }),
        ),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao criar imagens da post',
        error,
      );
    }
  }

  async getPost(id: number) {
    try {
      return this.prismaService.userPost.findUnique({
        where: {
          id,
        },
        include: {
          postImages: true,
          user: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar post',
        error,
      );
    }
  }

  async getPostComments(postId: number, cursor?: number, take?: number) {
    try {
      return paginator<PostCommentsResponseDto>(
        {
          model: this.prismaService.postComments,
          include: {
            user: true,
          },
          take,
          cursor,
        },
        { where: { postId } },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar comentários do post',
        error,
      );
    }
  }

  async getPostLikes(postId: number, cursor?: number, take?: number) {
    try {
      return paginator<PostLikesResponseDto>(
        {
          model: this.prismaService.postLikes,
          include: {
            user: true,
          },
          take,
          cursor,
        },
        { where: { postId } },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar likes do post',
        error,
      );
    }
  }

  async getUserPosts(userId: number) {
    try {
      return this.prismaService.userPost.findMany({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar posts do usuário',
        error,
      );
    }
  }

  async getALLposts(cursor?: number, take?: number) {
    try {
      return paginator<PostResponseDto>({
        model: this.prismaService.userPost,
        cursor,
        take,
        include: {
          postImages: true,
          user: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar posts',
        error,
      );
    }
  }

  async countPostLikes(postId: number) {
    try {
      return this.prismaService.postLikes.count({
        where: {
          postId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao contar likes do post',
        error,
      );
    }
  }

  async countPostComments(postId: number) {
    try {
      return this.prismaService.postComments.count({
        where: {
          postId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao contar comentários do post',
        error,
      );
    }
  }

  async createComment(data: Prisma.PostCommentsCreateInput) {
    try {
      return this.prismaService.postComments.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao criar novo comentário',
        error,
      );
    }
  }

  async createLike(data: Prisma.PostLikesCreateInput) {
    try {
      return this.prismaService.postLikes.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro interno ao dar like', error);
    }
  }

  async findPostById(id: number) {
    try {
      return this.prismaService.userPost.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar post',
        error,
      );
    }
  }

  async findLikeByUserId(userId: number, postId: number) {
    try {
      return this.prismaService.postLikes.findFirst({
        where: {
          AND: [
            {
              userId,
            },
            {
              postId,
            },
          ],
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar like',
        error,
      );
    }
  }

  async findCommentByUserId(userId: number, postId: number) {
    try {
      return this.prismaService.postComments.findFirst({
        where: {
          AND: [
            {
              userId,
            },
            {
              postId,
            },
          ],
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar comentário',
        error,
      );
    }
  }

  async runTransaction<T>(
    transactionFunction: TransactionFunction<T>,
  ): Promise<T> {
    try {
      return this.prismaService.$transaction(transactionFunction);
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro ao rodar transação na base de dados',
        error,
      );
    }
  }
}