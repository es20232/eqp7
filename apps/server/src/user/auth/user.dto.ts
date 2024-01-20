import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { SignUpDto } from './dto/auth.dto';

export class UserResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @Exclude()
  password: string;

  @Exclude()
  profilePicture: string;

  @ApiProperty()
  profilePictureUrl: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
export class UpdateUserDto extends PartialType(
  OmitType(SignUpDto, ['email', 'password'] as const),
) {}
