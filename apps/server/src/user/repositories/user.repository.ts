import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type TransactionFunction<T> = (prisma: PrismaService) => Promise<T>;

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    try {
      return this.prismaService.user.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao criar usuário',
        error,
      );
    }
  }

  async updateUser(data: Prisma.UserUpdateInput, id: number) {
    try {
      return this.prismaService.user.update({
        where: {
          id,
        },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao atualizar usuário',
        error,
      );
    }
  }

  async getUser(id: number) {
    try {
      return this.prismaService.user.findUnique({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar usuário por id',
        error,
      );
    }
  }

  async createUnverifiedUser(unverifiedUser: Prisma.UnverifiedUserCreateInput) {
    try {
      return this.prismaService.unverifiedUser.create({
        data: unverifiedUser,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao criar usuário não verificado',
        error,
      );
    }
  }

  async findUserByEmail(email: string) {
    try {
      return this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar usuário por email',
        error,
      );
    }
  }
  async findUserById(userId: number) {
    try {
      return this.prismaService.user.findUnique({
        where: { id: userId },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar usuário pelo id',
        error,
      );
    }
  }

  async findUnverifiedUserByEmail(email: string) {
    try {
      return this.prismaService.unverifiedUser.findUnique({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar usuário não verificado por email',
        error,
      );
    }
  }

  async findUserByUsername(username: string) {
    try {
      return this.prismaService.user.findUnique({
        where: {
          username,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar usuário por username',
        error,
      );
    }
  }

  async findUnverifiedUserByUsername(username: string) {
    try {
      return this.prismaService.unverifiedUser.findUnique({
        where: {
          username,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar usuário não verificado por username',
        error,
      );
    }
  }

  async deleteUnverifiedUser(id: number) {
    try {
      return this.prismaService.unverifiedUser.delete({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao deletar usuário não verificado',
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
