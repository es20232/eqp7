import {
  Body,
  Controller,
  HttpStatus,
  ParseFilePipeBuilder,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { User } from 'src/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreatePostDto } from './dto/post.dto';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}
  @UseInterceptors(
    FilesInterceptor('images', 10, {
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
  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Post()
  createPost(
    @User('id') userId: number,
    @Body() body: CreatePostDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: '.(png|jpeg|jpg)' })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    images: Express.Multer.File[],
  ) {
    return this.postService.createPost(body, images, userId);
  }
}
