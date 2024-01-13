import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import e from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokensRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createEmailToken(data: Prisma.ConfirmEmailTokenCreateInput) {
    try {
      return this.prismaService.confirmEmailToken.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao criar token de email', error)
    }

  }

  async updateEmailTokenByUserId(
    data: Prisma.ConfirmEmailTokenUpdateInput,
    unverifiedUserId: number,
  ) {
    try {
      return this.prismaService.confirmEmailToken.update({
        data,
        where: {
          unverifiedUserId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao atualizar token de email', error)
    }

  }

  async findEmailToken(token: string) {
    try {
      return this.prismaService.confirmEmailToken.findUnique({
        where: {
          token,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao buscar token de email', error)
    }

  }

  async findEmailTokenByUserId(id: number) {
    try {
      return this.prismaService.confirmEmailToken.findUnique({
        where: {
          unverifiedUserId: id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao buscar token de email por id de usuario', error)
    }

  }

  async deleteEmailTokenByUserId(id: number) {
    try {
      return this.prismaService.confirmEmailToken.delete({
        where: {
          unverifiedUserId: id,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao deletar token de email', error)
    }
  }

  async createResetToken(data: Prisma.ResetPasswordTokenCreateInput) {
    try {
      return this.prismaService.resetPasswordToken.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao criar token de redefinicao de senha', error)
    }

  }

  async updateResetTokenByUserId(
    data: Prisma.ResetPasswordTokenUpdateInput,
    userId: number,
  ) {
    try {
      return this.prismaService.resetPasswordToken.update({
        where: {
          userId,
        },
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao atualizar token de redefinicao de senha', error)
    }
  }

  async findResetToken(token: string) {
    try {
      return this.prismaService.resetPasswordToken.findUnique({
        where: {
          token,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao buscar token de redefinicao de senha', error)
    }
  }

  async findResetTokenByUserId(userId: number) {
    try {
      return this.prismaService.resetPasswordToken.findUnique({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao buscar token de redefinicao de senha por id de usuario', error)
    }

  }

  async deleteResetTokenByUserId(userId: number) {
    try {
      return this.prismaService.resetPasswordToken.delete({
        where: {
          userId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Erro na base de dados ao deletar token de redefinicao de senha', error)
    }
  }
}
