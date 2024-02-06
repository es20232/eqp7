import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { format } from 'date-fns';
import { UserResponseDto } from 'src/user/dto/user.dto';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: Express.Multer.File[];
}

export class PostCommentsResponseDto {
  @Exclude()
  postId: number;

  @Exclude()
  userId: number;

  @ApiProperty()
  comment: string;

  @Transform(({ value }) => {
    if (value instanceof Date) {
      return format(value, 'dd/MM/yyyy');
    }
  })
  @ApiProperty()
  date: Date;

  @ApiProperty()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  constructor(partial: Partial<PostCommentsResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PostLikesResponseDto {
  @Exclude()
  postId: number;

  @Exclude()
  userId: number;

  @Transform(({ value }) => {
    if (value instanceof Date) {
      return format(value, 'dd/MM/yyyy');
    }
  })
  @ApiProperty()
  date: Date;

  @ApiProperty()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  constructor(partial: Partial<PostLikesResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PostImagesResponseDto {
  @Exclude()
  postId: number;

  @ApiProperty()
  image: string;

  @ApiProperty()
  imageUrl: string;

  constructor(partial: Partial<PostImagesResponseDto>) {
    Object.assign(this, partial);
  }
}

export class PostResponseDto {
  @Exclude()
  userId: number;

  @ApiProperty()
  id: number;

  @ApiProperty()
  description: string;

  @Transform(({ value }) => {
    if (value instanceof Date) {
      return format(value, 'dd/MM/yyyy');
    }
  })
  @ApiProperty()
  date: Date;

  @ApiProperty()
  @Type(() => PostImagesResponseDto)
  postImages: PostImagesResponseDto[];

  @ApiProperty()
  totalLikes: number;

  @ApiProperty()
  totalComments: number;

  @ApiProperty()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  constructor(partial: Partial<PostResponseDto>) {
    Object.assign(this, partial);
  }
}

export class CreateCommentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  comment: string;
}
