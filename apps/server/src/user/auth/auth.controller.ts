import { Body, Controller, Get, Param, Post, Redirect, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  ForgotPasswordDto,
  ResendConfirmationLinkDto,
  ResetPasswordDto,
  SignUpDto,
} from './dto/auth.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { User, UserData } from 'src/decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({
    description:
      'Cadastra um novo usuário não verificado no sistema. Para ter os privilégios de um usuário normal, deve ser preciso haver a validação do email por parte do usuário',
  })
  @Post('/sign-up')
  signUp(@Body() body: SignUpDto) {
    return this.authService.signUp(body);
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

  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @Get('/me')
  me(@User() user: UserData) {
    return user
  }
}
