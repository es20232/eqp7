import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokensRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createEmailToken(data: Prisma.ConfirmEmailTokenCreateInput) {
    return this.prismaService.confirmEmailToken.create({
      data,
    });
  }

  async updateEmailTokenByUserId(
    data: Prisma.ConfirmEmailTokenUpdateInput,
    unverifiedUserId: number,
  ) {
    return this.prismaService.confirmEmailToken.update({
      data,
      where: {
        unverifiedUserId,
      },
    });
  }

  async findEmailToken(token: string) {
    return this.prismaService.confirmEmailToken.findUnique({
      where: {
        token,
      },
    });
  }

  async findEmailTokenByUserId(id: number) {
    return this.prismaService.confirmEmailToken.findUnique({
      where: {
        unverifiedUserId: id,
      },
    });
  }

  async deleteEmailTokenByUserId(id: number) {
    return this.prismaService.confirmEmailToken.delete({
      where: {
        unverifiedUserId: id,
      },
    });
  }

  async createResetToken(data: Prisma.ResetPasswordTokenCreateInput) {
    return this.prismaService.resetPasswordToken.create({
      data,
    });
  }

  async updateResetTokenByUserId(
    data: Prisma.ResetPasswordTokenUpdateInput,
    userId: number,
  ) {
    return this.prismaService.resetPasswordToken.update({
      where: {
        userId,
      },
      data,
    });
  }

  async findeResetToken(token: string) {
    return this.prismaService.resetPasswordToken.findUnique({
      where: {
        token,
      },
    });
  }

  async findResetTokenByUserId(userId: number) {
    return this.prismaService.resetPasswordToken.findUnique({
      where: {
        userId,
      },
    });
  }

  async deleteResetTokenByUserId(userId: number) {
    return this.prismaService.resetPasswordToken.delete({
      where: {
        userId,
      },
    });
  }
}
