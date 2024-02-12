import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { User } from 'src/decorators/user.decorator';
import { PaginationParamsDto } from 'src/dtos/paginator.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateCommentDto, CreatePostDto } from './dto/post.dto';
import { PostService } from './post.service';

@ApiTags('post')
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

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Delete(':id')
  deletePost(@User('id') userId: number, @Param('id') id: number) {
    return this.postService.deletePost(id, userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Delete(':id/:commentId')
  deleteComments(
    @Param('id') postId: number,
    @Param('commentId') id: number,
    @User('id') userId: number,
  ) {
    return this.postService.deleteComments(postId, id, userId);
  }

  @Get(':id')
  getPost(@Param('id') id: number) {
    return this.postService.getPost(id);
  }

  @Get()
  getAllPosts(
    @Query()
    { cursor, take }: PaginationParamsDto,
  ) {
    return this.postService.getAllPosts(cursor, take);
  }

  @Get(':id/likes')
  getPostLikes(
    @Param('id') id: number,
    @Query()
    { cursor, take }: PaginationParamsDto,
  ) {
    return this.postService.getPostLikes(id, cursor, take);
  }

  @Get(':id/deslikes')
  getPostDeslikes(
    @Param('id') id: number,
    @Query()
    { cursor, take }: PaginationParamsDto,
  ) {
    return this.postService.getPostDeslikes(id, cursor, take);
  }

  @Get(':id/comments')
  getPostComments(
    @Param('id') id: number,
    @Query()
    { cursor, take }: PaginationParamsDto,
  ) {
    return this.postService.getPostComments(id, cursor, take);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Post(':id/comment')
  createComment(
    @Body() body: CreateCommentDto,
    @User('id') userId: number,
    @Param('id') id: number,
  ) {
    return this.postService.createComment(id, userId, body);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Post(':id/like')
  createLike(@User('id') userId: number, @Param('id') id: number) {
    return this.postService.createLike(id, userId);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard)
  @Post(':id/deslike')
  createDeslike(@User('id') userId: number, @Param('id') id: number) {
    return this.postService.createDeslike(id, userId);
  }
}
