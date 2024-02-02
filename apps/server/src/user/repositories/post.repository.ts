import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

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
        'Erro na base de dados ao criar usuário',
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
              imageUrl: picture.filename, // substitua 'path' pelo campo correto do objeto 'picture'
            },
          }),
        ),
      );
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao criar imagens do post',
        error,
      );
    }
  }
}
