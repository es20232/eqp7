import {
  ConflictException,
  ForbiddenException,
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
import { UserService } from '../user.service';
import {
  ResendConfirmationLinkDto,
  SignInDto,
  SignUpDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private jwtSecret: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokensRepository: TokensRepository,
    private readonly mailService: MailService,
    private readonly userService: UserService,
  ) {
    this.jwtSecret = this.getTokenSecret();
  }

  async signUp(
    { name, email, password, username, bio }: SignUpDto,
    profilePicture?: Express.Multer.File,
  ) {
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

    const user = await this.userRepository.createUnverifiedUser({
      name,
      email,
      password: hashedPassword,
      username,
      profilePicture: profilePicture?.filename,
      bio,
    });

    return this.generateEmailToken(email, user.id);
  }

  async signIn(body: SignInDto) {
    const unverifiedUser =
      (await this.userRepository.findUnverifiedUserByEmail(body.user)) ||
      (await this.userRepository.findUnverifiedUserByUsername(body.user));

    if (unverifiedUser) {
      throw new ForbiddenException({
        message:
          'Email passível de validação. Por favor, cheque seu email e confirme seu cadastro através do link que nós enviamos. Não encontrou? Clique no botão abaixo para que um novo link seja enviado ao seu email.',
        cause: 'unverifiedUser',
        userEmail: unverifiedUser.email,
      });
    }
    const userExists =
      (await this.userRepository.findUserByEmail(body.user)) ||
      (await this.userRepository.findUserByUsername(body.user));

    if (!userExists) {
      throw new UnauthorizedException('Credenciais Inválidas');
    }
    try {
      const hashedPassword = userExists.password;

      const isValidPassword = await bcrypt.compare(
        body.password,
        hashedPassword,
      );

      if (!isValidPassword) {
        throw new UnauthorizedException('Credenciais Inválidas');
      }
      const { accessToken, refreshToken } = await this.generateTokens(
        userExists.name,
        userExists.id,
      );

      const decodedAccessToken = jwt.decode(accessToken) as jwt.JwtPayload;
      const accessTokenExpirationTime = decodedAccessToken?.exp;

      const decodedRefreshToken = jwt.decode(refreshToken) as jwt.JwtPayload;
      const refreshTokenExpirationTime = decodedRefreshToken?.exp;

      const token = await this.tokensRepository.createRefreshToken({
        token: refreshToken,
        user: {
          connect: {
            id: userExists.id,
          },
        },
      });
      const user = await this.userService.getProfile(userExists.id);

      return {
        user,
        accessToken: {
          value: accessToken,
          expiresIn: accessTokenExpirationTime,
        },
        refreshToken: {
          value: refreshToken,
          expiresIn: refreshTokenExpirationTime,
          tokenId: token.id,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async signOut(tokenId: number, userId: number) {
    try {
      const token = await this.tokensRepository.findRefreshTokenById(tokenId);
      if (token?.userId !== userId) {
        throw new UnauthorizedException();
      }
      await this.tokensRepository.deleteRefreshTokenById(tokenId);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async refresh(refreshToken: string, tokenId: number) {
    try {
      const foundToken =
        await this.tokensRepository.findRefreshTokenById(tokenId);
      if (foundToken) {
        const user = await this.userRepository.findUserById(foundToken.userId);
        if (!user) {
          throw new UnauthorizedException(
            'Usuário referente ao token não encontrado',
          );
        }
        const isMatch = foundToken?.token === refreshToken;

        if (isMatch) {
          const { accessToken, refreshToken } = await this.generateTokens(
            user.name,
            user.id,
          );

          const token = await this.tokensRepository.updateRefreshTokenById(
            refreshToken,
            tokenId,
          );

          const decodedAccessToken = jwt.decode(accessToken) as jwt.JwtPayload;
          const accessTokenExpirationTime = decodedAccessToken?.exp;

          const decodedRefreshToken = jwt.decode(
            refreshToken,
          ) as jwt.JwtPayload;
          const refreshTokenExpirationTime = decodedRefreshToken?.exp;

          return {
            accessToken: {
              value: accessToken,
              expiresIn: accessTokenExpirationTime,
            },
            refreshToken: {
              value: refreshToken,
              expiresIn: refreshTokenExpirationTime,
              tokenId: token.id,
            },
          };
        }
        throw new UnauthorizedException(
          'Token enviado e token da base de dados não coincidem',
        );
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async confirmEmail(emailToken: string) {
    const token = await this.tokensRepository.findEmailToken(emailToken);

    if (!token) {
      return { url: process.env.FAILURE_SIGN_UP_LINK + '?error=invalidToken' };
    }

    try {
      const payload = jwt.verify(emailToken, this.jwtSecret) as jwt.JwtPayload;

      const user = await this.userRepository.findUnverifiedUserByEmail(
        payload.email,
      );

      if (!user) {
        return {
          url: process.env.FAILURE_SIGN_UP_LINK + '?error=userNotFound',
        };
      }

      await this.userRepository.runTransaction(async () => {
        await this.userRepository.createUser({
          email: user.email,
          name: user.name,
          username: user.username,
          password: user.password,
          profilePicture: user.profilePicture,
        });

        await this.userRepository.deleteUnverifiedUser(token.unverifiedUserId);
      });
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return {
          url: process.env.FAILURE_SIGN_UP_LINK + '?error=expiretedToken',
        };
      } else if (error instanceof jwt.JsonWebTokenError) {
        return {
          url: process.env.FAILURE_SIGN_UP_LINK + '?error=malformedToken',
        };
      } else {
        return {
          url: process.env.FAILURE_SIGN_UP_LINK + `?error=${error}`,
        };
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
    const token = await this.tokensRepository.findResetToken(resetToken);

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
}
