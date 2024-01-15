import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'Luis',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'LuisUser11',
    minLength: 4,
    maxLength: 20,
    description:
      'Username sendo alfanumérico e não podendo ter espaços ou caracteres especiais',
  })
  @IsString()
  @IsNotEmpty()
  @IsAlphanumeric()
  @MinLength(4)
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9]*$/, {
    message: 'O username não pode conter espaços ou caracteres especiais.',
  })
  username: string;

  @ApiProperty({
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'A senha deve conter pelo menos 6 caracteres, incluindo pelo menos um dígito, uma letra minúscula uma letra maiúscula',
    example: 'Teste123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{6,}$/, {
    message:
      'A senha deve conter pelo menos 6 caracteres, incluindo pelo menos um dígito, uma letra minúscula uma letra maiúscula',
  })
  password: string;

  @ApiProperty({ type: 'string', format: 'binary' })
  profilePicture: Express.Multer.File;
}

export class ResendConfirmationLinkDto {
  @ApiProperty({
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;

  @IsNumber()
  @IsPositive()
  id: number;
}

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'test@test.com',
  })
  @IsEmail()
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({
    description:
      'A senha deve conter pelo menos 6 caracteres, incluindo pelo menos um dígito, uma letra minúscula uma letra maiúscula',
    example: 'Teste123',
    minLength: 6,
  })
  @IsString()
  @Matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z$*&@#]{6,}$/, {
    message:
      'A senha deve conter pelo menos 6 caracteres, incluindo pelo menos um dígito, uma letra minúscula uma letra maiúscula',
  })
  password: string;
}
