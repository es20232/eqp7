import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers?.authorization?.split('Bearer ')[1];

    if (!process.env.TOKEN_SECRET) {
      throw new Error('TOKEN_SECRET is not defined in environment variables');
    }

    try {
      const payload = jwt.verify(
        token,
        process.env.TOKEN_SECRET,
      ) as jwt.JwtPayload;

      const user = await this.prismaService.user.findUnique({
        where: {
          id: payload.id,
        },
      });

      if (!user) return false;

      request.user = payload;
    } catch (error) {
      return false;
    }
    return true;
  }
}
