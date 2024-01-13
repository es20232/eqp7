import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type TransactionFunction<T> = (prisma: PrismaService) => Promise<T>;

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput) {
    return this.prismaService.user.create({
      data,
    });
  }

  async updateUser(data: Prisma.UserUpdateInput, id: number) {
    return this.prismaService.user.update({
      where: {
        id,
      },
      data,
    });
  }

  async createUnverifiedUser(unverifiedUser: Prisma.UnverifiedUserCreateInput) {
    return this.prismaService.unverifiedUser.create({
      data: unverifiedUser,
    });
  }

  async findUserByEmail(email: string) {
    return this.prismaService.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUnverifiedUserByEmail(email: string) {
    return this.prismaService.unverifiedUser.findUnique({
      where: {
        email,
      },
    });
  }

  async findUserByUsername(username: string) {
    return this.prismaService.user.findUnique({
      where: {
        username,
      },
    });
  }

  async findUnverifiedUserByUsername(username: string) {
    return this.prismaService.unverifiedUser.findUnique({
      where: {
        username,
      },
    });
  }

  async deleteUnverifiedUser(id: number) {
    return this.prismaService.unverifiedUser.delete({
      where: {
        id,
      },
    });
  }

  async runTransaction<T>(
    transactionFunction: TransactionFunction<T>,
  ): Promise<T> {
    return this.prismaService.$transaction(transactionFunction);
  }
}
