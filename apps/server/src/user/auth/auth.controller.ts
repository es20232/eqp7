import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Redirect,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResendConfirmationLinkDto,
  ResetPasswordDto,
  SignUpDto,
} from './dto/auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseInterceptors(
    FileInterceptor('profilePicture', {
      storage: diskStorage({
        destination: 'uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = `${Date.now()}_${Math.floor(
            Math.random() * 10000 + 10000,
          )}`;

          const filename = `${uniqueSuffix}_${file.originalname}`;

          callback(null, filename);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description:
      'Cadastra um novo usuário não verificado no sistema. Para ter os privilégios de um usuário normal, deve ser preciso haver a validação do email por parte do usuário',
  })
  @Post('/sign-up')
  signUp(
    @Body() body: SignUpDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    profilePicture: Express.Multer.File,
  ) {
    return this.authService.signUp(body, profilePicture);
  }

  @Redirect(process.env.SUCCESSFUL_SIGN_UP_LINK, 302)
  @Get('/confirm-email/:token')
  confirmEmail(@Param('token') emailToken: string) {
    return this.authService.confirmEmail(emailToken);
  }

  @Post('/resend-confirmation-link')
  resendEmailConfirmationLink(@Body() body: ResendConfirmationLinkDto) {
    return this.authService.resendEmailConfirmationLink(body);
  }

  @ApiOkResponse({
    description:
      'Envia uma mensagem para o email fornecido pelo usuário com um link para criar uma nova senha',
  })
  @Post('/forgot-password')
  generateResetToken(@Body() body: ForgotPasswordDto) {
    return this.authService.generateResetToken(body.email);
  }

  @ApiOkResponse({
    description: 'Atualiza a senha do usuário',
  })
  @Post('/reset-password/:token')
  resetPassword(
    @Param('token') resetToken: string,
    @Body() body: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(resetToken, body.password);
  }
}
