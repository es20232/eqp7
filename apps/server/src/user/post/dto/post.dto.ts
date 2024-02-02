import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ type: 'array', items: { type: 'string', format: 'binary' } })
  images: Express.Multer.File[];
}
