import { Module } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PostController } from './post/post.controller';
import { PostService } from './post/post.service';
import { PostRepository } from './repositories/post.repository';
import { TokensRepository } from './repositories/tokens.repository';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, MailModule],
  controllers: [AuthController, UserController, PostController],
  providers: [
    AuthService,
    UserRepository,
    TokensRepository,
    PostRepository,
    UserService,
    PostService,
  ],
})
export class UserModule {}
