import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto, UserResponseDto } from './auth/user.dto';
import { UserRepository } from './repositories/user.repository';
import { TokensRepository } from './repositories/tokens.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokensRepository: TokensRepository,
  ) {}

  async getProfile(userId: number) {
    const user = await this.userRepository.getUser(userId);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const url = `${process.env.APP_URL}/uploads`;

    const userWithProfilePictureUrl = {
      ...user,
      profilePictureUrl: `${url}/${user.profilePicture}`,
    };

    return new UserResponseDto(userWithProfilePictureUrl);
  }
  async updateUser(
    { name, username }: UpdateUserDto,
    userId: number,
    profilePicture?: Express.Multer.File,
  ) {
    const user = await this.userRepository.findUserById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    if (username) {
      const usernameExists =
        await this.userRepository.findUserByUsername(username);

      const unverifiedUsernameExists =
        await this.userRepository.findUnverifiedUserByUsername(username);

      if (usernameExists || unverifiedUsernameExists) {
        throw new ConflictException('Nome de usuário já cadastrado');
      }
    }
    try {
      const updatedUser = await this.userRepository.updateUser(
        { name, username, profilePicture: profilePicture?.filename },
        userId,
      );
      const { accessToken, refreshToken } =
        await this.tokensRepository.generateTokens(user.name, user.id);

      const updatedUserResponse = new UserResponseDto(updatedUser);

      return { updatedUserResponse, accessToken, refreshToken };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
