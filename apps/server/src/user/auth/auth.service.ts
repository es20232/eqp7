import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { MailService } from 'src/mail/mail.service';
import { TokensRepository } from '../repositories/tokens.repository';
import { UserRepository } from '../repositories/user.repository';
import { ResendConfirmationLinkDto, SignUpDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private jwtSecret: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly mailService: MailService,
  ) {
    this.jwtSecret = this.getTokenSecret();
  }

  async signUp({ name, email, password, username }: SignUpDto) {
    const emailExists = await this.userRepository.findUserByEmail(email);

    const unverifiedEmailExists =
      await this.userRepository.findUnverifiedUserByEmail(email);

    const usernameExists =
      await this.userRepository.findUserByUsername(username);

    const unverifiedUsernameExists =
      await this.userRepository.findUnverifiedUserByUsername(username);

    if (emailExists || unverifiedEmailExists) {
      throw new ConflictException('Email já cadastrado');
    }

    if (usernameExists || unverifiedUsernameExists) {
      throw new ConflictException('Nome de usuário já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicture = '';

    const user = await this.userRepository.createUnverifiedUser({
      name,
      email,
      password: hashedPassword,
      username,
      profilePicture,
    });

    return this.generateEmailToken(email, user.id);
  }

  async confirmEmail(emailToken: string) {
    const token = await this.tokensRepository.findEmailToken(emailToken);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Token inválido',
        cause: 'invalidToken',
      });
    }

    try {
      const payload = jwt.verify(
        emailToken,
        this.jwtSecret,
      ) as jwt.JwtPayload;

      const user = await this.userRepository.findUnverifiedUserByEmail(
        payload.email,
      );

      if (!user) {
        throw new NotFoundException('Usuário não encontrado no sistema');
      }

      await this.userRepository.runTransaction(async () => {
        await this.userRepository.createUser({
          email: user.email,
          name: user.name,
          username: user.username,
          password: user.password,
          profilePicture: user.profilePicture,
        });

        await this.userRepository.deleteUnverifiedUser(
          token.unverifiedUserId,
        );
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException({
          message:
            'Tempo de expiração alcançado. Clique no botão abaixo para que um novo link seja enviado para seu email.',
          cause: 'expiratedToken',
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException({
          message: 'Token com má-formação',
          cause: 'malformedToken',
        });
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async resendEmailConfirmationLink(body: ResendConfirmationLinkDto) {
    const unverifiedUser = await this.userRepository.findUnverifiedUserByEmail(
      body.email,
    );

    if (!unverifiedUser) {
      throw new NotFoundException('Email fornecido não encontrado');
    }

    return this.generateEmailToken(body.email, body.id);
  }

  private async generateEmailToken(email: string, id: number) {
    try {
      const emailToken = jwt.sign({ email, id }, this.jwtSecret, {
        expiresIn: process.env.CONFIRM_EMAIL_TOKEN_EXPIRATION,
      });

      const userHasEmailToken =
        await this.tokensRepository.findEmailTokenByUserId(id);

      if (userHasEmailToken) {
        await this.tokensRepository.updateEmailTokenByUserId(
          {
            token: emailToken,
          },
          id,
        );
      } else {
        await this.tokensRepository.createEmailToken({
          token: emailToken,
          unverifiedUser: {
            connect: {
              id,
            },
          },
        });
      }

      return this.mailService.sendEmailVerifyUserEmail(email, emailToken);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async generateResetToken(email: string) {
      const user = await this.userRepository.findUserByEmail(email);

      if (!user) {
        throw new NotFoundException('Email de usuário não encontrado');
      }

      try {
        const resetToken = jwt.sign(
          { name: user.name, id: user.id },
          this.jwtSecret,
          {
            expiresIn: process.env.RESET_TOKEN_EXPIRATION,
          },
        );

        const userHasResetToken =
          await this.tokensRepository.findResetTokenByUserId(user.id);

        if (userHasResetToken) {
          await this.tokensRepository.updateResetTokenByUserId(
            {
              token: resetToken,
            },
            user.id,
          );
        } else {
          await this.tokensRepository.createResetToken({
            token: resetToken,
            user: {
              connect: {
                id: user.id,
              },
            },
          });
        }

        return this.mailService.sendEmailResetPassword(email, resetToken);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
  }

  async resetPassword(resetToken: string, newPassword: string) {
    const token = await this.tokensRepository.findeResetToken(resetToken);

    if (!token) {
      throw new UnauthorizedException({
        message: 'Token inválido',
        cause: 'invalidToken',
      });
    }

    try {
      jwt.verify(resetToken, this.jwtSecret);
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedException({
          message:
            'Tempo de expiração alcançado. Clique no botão abaixo para que um novo link seja enviado para seu email.',
          cause: 'expiratedToken',
        });
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedException({
          message: 'Token com má-formação',
          cause: 'malformedToken',
        });
      } else {
        throw new InternalServerErrorException(error);
      }
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.userRepository.runTransaction(async () => {
      await this.userRepository.updateUser(
        {
          password: hashedPassword,
        },
        token.userId,
      );

      await this.tokensRepository.deleteResetTokenByUserId(token.userId);
    });
  }

  private getTokenSecret() {
    if (!process.env.TOKEN_SECRET) {
      throw new Error('TOKEN_SECRET is not defined in environment variables');
    }
    return process.env.TOKEN_SECRET;
  }
}
