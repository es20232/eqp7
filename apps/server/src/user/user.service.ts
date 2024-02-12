import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { TokensRepository } from './repositories/tokens.repository';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  private jwtSecret: string;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokensRepository: TokensRepository,
  ) {
    this.jwtSecret = this.getTokenSecret();
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.getUser(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const url = `${process.env.APP_URL}/uploads`;

    if (user.profilePicture) {
      const userWithProfilePictureUrl = {
        ...user,
        profilePictureUrl: `${url}/${user.profilePicture}`,
      };

      return new UserResponseDto(userWithProfilePictureUrl);
    }

    return new UserResponseDto(user);
  }

  async updateUser(
    { name, username, bio }: UpdateUserDto,
    userId: number,
    profilePicture?: Express.Multer.File,
  ) {
    console.log(bio);
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (username) {
      const usernameExists =
        await this.userRepository.findUserByUsername(username);

      const unverifiedUsernameExists =
        await this.userRepository.findUnverifiedUserByUsername(username);

      if (usernameExists?.id != userId) {
        if (usernameExists || unverifiedUsernameExists) {
          throw new ConflictException('Nome de usuário já cadastrado');
        }
      }
    }
    try {
      await this.userRepository.updateUser(
        { name, username, bio, profilePicture: profilePicture?.filename },
        userId,
      );
      const { accessToken, refreshToken } = await this.generateTokens(
        user.name,
        user.id,
      );

      const updatedUser = await this.getProfile(userId);

      const updatedUserResponse = new UserResponseDto(updatedUser);

      return { updatedUserResponse, accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(error);
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
}
