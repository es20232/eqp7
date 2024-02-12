import { Module, forwardRef } from '@nestjs/common';
import { MailModule } from 'src/mail/mail.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PostRepository } from './repositories/post.repository';
import { TokensRepository } from './repositories/tokens.repository';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PostModule } from './post/post.module';

@Module({
  imports: [PrismaModule, MailModule, forwardRef(() => PostModule)],
  controllers: [UserController],
  providers: [UserRepository, TokensRepository, PostRepository, UserService],
  exports: [UserRepository, TokensRepository, PostRepository, UserService],
})
export class UserModule {}
