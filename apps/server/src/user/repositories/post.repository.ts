import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import paginator from 'src/utils/paginator';
import {
  PostCommentsResponseDto,
  PostDeslikesResponseDto,
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

  async deletePost(id: number) {
    try {
      await this.prismaService.userPost.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao deletar post',
        error,
      );
    }
  }

  async deleteComments(id: number, postId: number) {
    try {
      await this.prismaService.postComments.delete({
        where: {
          id,
          postId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao deletar comentário',
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

  async getPostDeslikes(postId: number, cursor?: number, take?: number) {
    try {
      return paginator<PostDeslikesResponseDto>(
        {
          model: this.prismaService.postDeslikes,
          take,
          cursor,
        },
        { where: { postId } },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar deslikes do post',
        error,
      );
    }
  }

  async getUserPosts(userId: number, cursor?: number, take?: number) {
    try {
      return paginator<PostResponseDto>(
        {
          model: this.prismaService.userPost,
          cursor,
          take,
          include: {
            postImages: true,
            user: true,
          },
        },
        {
          where: {
            userId,
          },
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar posts',
        error,
      );
    }
  }

  async getAllPosts(cursor?: number, take?: number) {
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

  async countPostDeslikes(postId: number) {
    try {
      return this.prismaService.postDeslikes.count({
        where: {
          postId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao contar deslikes do post',
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

  async createDeslike(data: Prisma.PostDeslikesCreateInput) {
    try {
      return this.prismaService.postDeslikes.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao dar deslike',
        error,
      );
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

  async findDeslikeByUserId(userId: number, postId: number) {
    try {
      return this.prismaService.postDeslikes.findFirst({
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
        'Erro interno ao buscar deslike',
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
