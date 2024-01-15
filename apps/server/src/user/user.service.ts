import { Injectable, NotFoundException } from '@nestjs/common';
import { UserResponseDto } from './auth/user.dto';
import { UserRepository } from './repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

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
}
