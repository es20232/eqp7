import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
        'Erro na base de dados ao criar publicação',
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
        'Erro na base de dados ao criar imagens da publicação',
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
          postComments: {
            include: {
              user: true,
            },
          },
          postImages: true,
          postLikes: {
            include: {
              user: true,
            },
          },
          user: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro interno ao buscar publicação',
        error,
      );
    }
  }
}
