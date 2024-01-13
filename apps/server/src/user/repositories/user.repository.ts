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
      throw new InternalServerErrorException('Erro na base de dados ao criar usuario', error)
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
      throw new InternalServerErrorException('Erro na base de dados ao atualizar usuario', error)
    }
  }

  async createUnverifiedUser(unverifiedUser: Prisma.UnverifiedUserCreateInput) {
    try {
      return this.prismaService.unverifiedUser.create({
        data: unverifiedUser,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao criar usuario nao verificado', error)
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
      throw new InternalServerErrorException('Erro na base de dados ao buscar usuario por email', error)
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
      throw new InternalServerErrorException('Erro na base de dados ao buscar usuario nao verificado por email', error)
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
      throw new InternalServerErrorException('Erro na base de dados ao buscar usuario por username', error)
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
      throw new InternalServerErrorException('Erro na base de dados ao buscar usuario nao verificado por username', error)
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
      throw new InternalServerErrorException('Erro na base de dados ao deletar usuario nao verificado', error)
    }
  }

  async runTransaction<T>(
    transactionFunction: TransactionFunction<T>,
  ): Promise<T> {
    try {
      return this.prismaService.$transaction(transactionFunction);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao rodar transacao na base de dados', error)
    }

  }
}
