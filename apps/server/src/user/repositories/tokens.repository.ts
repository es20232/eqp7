import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokensRepository {
  private readonly jwtSecret: string;
  constructor(private readonly prismaService: PrismaService) {
    this.jwtSecret = this.getTokenSecret();
  }

  async createEmailToken(data: Prisma.ConfirmEmailTokenCreateInput) {
    try {
      return this.prismaService.confirmEmailToken.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao criar token de email',
        error,
      );
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
      throw new InternalServerErrorException(
        'Erro na base de dados ao atualizar token de email',
        error,
      );
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
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar token de email',
        error,
      );
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
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar token de email por id de usuário',
        error,
      );
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
      throw new InternalServerErrorException(
        'Erro na base de dados ao deletar token de email',
        error,
      );
    }
  }

  async createResetToken(data: Prisma.ResetPasswordTokenCreateInput) {
    try {
      return this.prismaService.resetPasswordToken.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao criar token de redefinição de senha',
        error,
      );
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
      throw new InternalServerErrorException(
        'Erro na base de dados ao atualizar token de redefinição de senha',
        error,
      );
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
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar token de redefinição de senha',
        error,
      );
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
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar token de redefinição de senha por id de usuário',
        error,
      );
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
      throw new InternalServerErrorException(
        'Erro na base de dados ao deletar token de redefinição de senha',
        error,
      );
    }
  }
  async generateTokens(name: string, id: number) {
    try {
      const accessToken = jwt.sign({ name, id }, this.jwtSecret, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION,
      });

      const refreshToken = jwt.sign({ name, id }, this.jwtSecret, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRATION,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  private getTokenSecret() {
    if (!process.env.TOKEN_SECRET) {
      throw new Error('TOKEN_SECRET is not defined in environment variables');
    }
    return process.env.TOKEN_SECRET;
  }
  async createRefreshToken(data: Prisma.RefreshTokenUncheckedCreateInput) {
    try {
      return await this.prismaService.refreshToken.create({
        data,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao criar refresh token',
        error,
      );
    }
  }

  async findRefreshTokenById(tokenId: number) {
    try {
      return this.prismaService.refreshToken.findUnique({
        where: {
          id: tokenId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao buscar token de acesso',
        error,
      );
    }
  }
  async updateRefreshTokenById(refreshToken: string, tokenId: number) {
    try {
      return this.prismaService.refreshToken.update({
        where: {
          id: tokenId,
        },
        data: {
          token: refreshToken,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao atualizar refresh token',
        error,
      );
    }
  }
  async deleteRefreshTokenById(tokenId: number) {
    try {
      return this.prismaService.refreshToken.delete({
        where: {
          id: tokenId,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Erro na base de dados ao deletar token de acesso',
        error,
      );
    }
  }
}
