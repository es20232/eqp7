import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { PostService } from './post/post.service';
import { UserService } from './user.service';
import { PaginationParamsDto } from 'src/dtos/paginator.dto';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly postService: PostService,
  ) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @Get('/profile')
  getProfile(@User('id') userId: number) {
    return this.userService.getProfile(userId);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @Get(':id/posts')
  getUserPosts(
    @Param('id') userId: number,
    @Query() { cursor, take }: PaginationParamsDto,
  ) {
    return this.postService.getUserPosts(userId, cursor, take);
  }

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth('jwt')
  @Put('/update')
  updateUser(
    @Body() body: UpdateUserDto,
    @User('id') userId: number,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    profilePicture?: Express.Multer.File,
  ) {
    console.log(body.bio);
    return this.userService.updateUser(body, userId, profilePicture);
  }
}
