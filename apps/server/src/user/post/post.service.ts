import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PostRepository } from '../repositories/post.repository';
import { UserRepository } from '../repositories/user.repository';
import { UserService } from '../user.service';
import {
  CreateCommentDto,
  CreatePostDto,
  PostCommentsResponseDto,
  PostDeslikesResponseDto,
  PostLikesResponseDto,
  PostResponseDto,
} from './dto/post.dto';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly userRepository: UserRepository,
    private readonly userService: UserService,
  ) {}
  async createPost(
    { description }: CreatePostDto,
    postImages: Express.Multer.File[],
    userId: number,
  ) {
    const result = await this.postRepository.runTransaction(async () => {
      const postUser = await this.postRepository.createPost({
        user: {
          connect: {
            id: userId,
          },
        },
        description,
      });
      await this.postRepository.postImages(postUser.id, postImages);

      return postUser;
    });

    return { id: result.id };
  }

  async deletePost(id: number, userId: number) {
    const post = await this.postRepository.findPostById(id);

    if (!post) {
      throw new NotFoundException('Publicação não encontrada');
    }

    if (post.userId != userId) {
      throw new NotFoundException('Sem permissão para deletar essa publicação');
    }

    await this.postRepository.deletePost(id);
  }

  async deleteComments(postId: number, id: number, userId: number) {
    const post = await this.postRepository.findPostById(postId);

    if (!post) {
      throw new NotFoundException('Publicação não encontrada');
    }

    if (post.userId != userId) {
      throw new NotFoundException('Não é possível deletar esse comentário');
    }

    await this.postRepository.deleteComments(id, postId);
  }

  async getPost(id: number, userId: number) {
    const post = await this.postRepository.getPost(id);

    if (!post) {
      throw new NotFoundException('Publicação não encontrada');
    }

    const totalLikes = await this.postRepository.countPostLikes(id);

    const totalComments = await this.postRepository.countPostComments(id);

    const totalDeslikes = await this.postRepository.countPostDeslikes(id);

    const hasUserLiked = await this.postRepository.findLikeByUserId(userId, id);

    const hasUserDesliked = await this.postRepository.findDeslikeByUserId(
      userId,
      id,
    );

    const hasUserCommented = await this.postRepository.findCommentByUserId(
      userId,
      id,
    );

    const url = `${process.env.APP_URL}/uploads`;

    const postWithUrl = {
      ...post,
      postImages: post.postImages.map((image) => ({
        ...image,
        imageUrl: `${url}/${image.image}`,
      })),
      totalLikes,
      totalComments,
      totalDeslikes,
      hasUserLiked: hasUserLiked ? true : false,
      hasUserDesliked: hasUserDesliked ? true : false,
      hasUserCommented: hasUserCommented ? true : false,
    };

    return new PostResponseDto(postWithUrl);
  }

  async getPostLikes(id: number, cursor?: number, take?: number) {
    const likes = await this.postRepository.getPostLikes(id, cursor, take);

    const likesWithPictureUrl = await Promise.all(
      likes.data.map(async (like) => ({
        ...like,
        user: await this.userService.getProfile(like.userId),
      })),
    );

    const transformedData = likesWithPictureUrl.map((like) => {
      return new PostLikesResponseDto(like);
    });

    return { data: transformedData, meta: likes.meta };
  }

  async getPostDeslikes(id: number, cursor?: number, take?: number) {
    const deslikes = await this.postRepository.getPostDeslikes(
      id,
      cursor,
      take,
    );

    const deslikesWithPictureUrl = await Promise.all(
      deslikes.data.map(async (deslike) => ({
        ...deslike,
        user: await this.userService.getProfile(deslike.userId),
      })),
    );

    const transformedData = deslikesWithPictureUrl.map((deslike) => {
      return new PostDeslikesResponseDto(deslike);
    });

    return { data: transformedData, meta: deslikes.meta };
  }

  async getPostComments(id: number, cursor?: number, take?: number) {
    const comments = await this.postRepository.getPostComments(
      id,
      cursor,
      take,
    );

    const commentsWithPictureUrl = await Promise.all(
      comments.data.map(async (comment) => ({
        ...comment,
        user: await this.userService.getProfile(comment.userId),
      })),
    );

    const transformedData = commentsWithPictureUrl.map((comment) => {
      return new PostCommentsResponseDto(comment);
    });

    return { data: transformedData, meta: comments.meta };
  }

  async getUserPosts(
    userPostId: number,
    userId: number,
    cursor?: number,
    take?: number,
  ) {
    const posts = await this.postRepository.getUserPosts(
      userPostId,
      cursor,
      take,
    );

    const url = `${process.env.APP_URL}/uploads`;

    const postsWithUrls = await Promise.all(
      posts.data.map(async (post) => ({
        ...post,
        postImages: post.postImages.map((image) => ({
          ...image,
          imageUrl: `${url}/${image.image}`,
        })),
        totalLikes: await this.postRepository.countPostLikes(post.id),
        totalDeslikes: await this.postRepository.countPostDeslikes(post.id),
        totalComments: await this.postRepository.countPostComments(post.id),
        user: await this.userService.getProfile(post.userId),
        hasUserLiked: (await this.postRepository.findLikeByUserId(
          userId,
          post.id,
        ))
          ? true
          : false,
        hasUserDesliked: (await this.postRepository.findDeslikeByUserId(
          userId,
          post.id,
        ))
          ? true
          : false,
        hasUserCommented: (await this.postRepository.findCommentByUserId(
          userId,
          post.id,
        ))
          ? true
          : false,
      })),
    );

    const transformedData = postsWithUrls.map((post) => {
      return new PostResponseDto(post);
    });

    return { data: transformedData, meta: posts.meta };
  }

  async getAllPosts(userId: number, cursor?: number, take?: number) {
    const posts = await this.postRepository.getAllPosts(cursor, take);

    const url = `${process.env.APP_URL}/uploads`;

    const postsWithUrls = await Promise.all(
      posts.data.map(async (post) => ({
        ...post,
        postImages: post.postImages.map((image) => ({
          ...image,
          imageUrl: `${url}/${image.image}`,
        })),
        totalLikes: await this.postRepository.countPostLikes(post.id),
        totalDeslikes: await this.postRepository.countPostDeslikes(post.id),
        totalComments: await this.postRepository.countPostComments(post.id),
        user: await this.userService.getProfile(post.userId),
        hasUserLiked: (await this.postRepository.findLikeByUserId(
          userId,
          post.id,
        ))
          ? true
          : false,
        hasUserDesliked: (await this.postRepository.findDeslikeByUserId(
          userId,
          post.id,
        ))
          ? true
          : false,
        hasUserCommented: (await this.postRepository.findCommentByUserId(
          userId,
          post.id,
        ))
          ? true
          : false,
      })),
    );

    const transformedData = postsWithUrls.map((post) => {
      return new PostResponseDto(post);
    });

    return { data: transformedData, meta: posts.meta };
  }

  async createComment(postId: number, userId: number, body: CreateCommentDto) {
    const userExists = await this.userRepository.findUserById(userId);

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const postExists = await this.postRepository.findPostById(postId);

    if (!postExists) {
      throw new NotFoundException('Post não encontrado');
    }

    const hasUserCommented = await this.postRepository.findCommentByUserId(
      userId,
      postId,
    );

    if (hasUserCommented) {
      throw new ConflictException(
        'Não é possível fazer mais de um comentário por postagem',
      );
    }

    const comment = await this.postRepository.createComment({
      user: {
        connect: {
          id: userId,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
      comment: body.comment,
    });

    return { id: comment.id };
  }

  async createLike(postId: number, userId: number) {
    const userExists = await this.userRepository.findUserById(userId);

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const postExists = await this.postRepository.findPostById(postId);

    if (!postExists) {
      throw new NotFoundException('Post não encontrado');
    }

    const hasUserLiked = await this.postRepository.findLikeByUserId(
      userId,
      postId,
    );

    if (hasUserLiked) {
      throw new ConflictException(
        'Não é possível dar mais de um like por postagem',
      );
    }

    const like = await this.postRepository.createLike({
      user: {
        connect: {
          id: userId,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    });

    return { id: like.id };
  }

  async createDeslike(postId: number, userId: number) {
    const userExists = await this.userRepository.findUserById(userId);

    if (!userExists) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const postExists = await this.postRepository.findPostById(postId);

    if (!postExists) {
      throw new NotFoundException('Post não encontrado');
    }

    const hasUserDesliked = await this.postRepository.findDeslikeByUserId(
      userId,
      postId,
    );

    if (hasUserDesliked) {
      throw new ConflictException(
        'Não é possível dar mais de um deslike por postagem',
      );
    }

    const deslike = await this.postRepository.createDeslike({
      user: {
        connect: {
          id: userId,
        },
      },
      post: {
        connect: {
          id: postId,
        },
      },
    });

    return { id: deslike.id };
  }
}
