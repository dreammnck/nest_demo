import { PrismaService } from './../prisma/prisma.service';
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {
  c;

  constructor(private readonly prismaService: PrismaService) {}

  async create(createPostDto: CreatePostDto, userId: number) {
    const post = await this.prismaService.post.create({
      data: { ...createPostDto, userId },
    });
    return new Post({
      title: post.title,
      body: post.body,
      createdDate: post.create_time,
    });
  }

  async findPostById(postId: number, userId: number) {
    const post = await this.prismaService.post.findUnique({
      where: { id: postId },
    });
    if (!post) {
      throw new BadRequestException({
        message: `Could not find post's ${postId}`,
      });
    }
    if (post.userId !== userId) {
      throw new ForbiddenException({ message: `This is not your post` });
    }

    return new Post({
      title: post.title,
      body: post.body,
      createdDate: post.create_time,
      updatedDate: post.update_time,
    });
  }

  async findMany(userId: number) {
    const posts = await this.prismaService.post.findMany({
      where: { userId: userId },
    });
    if (!posts) {
      throw new BadRequestException({ message: `You don't have any posts` });
    }

    const filterPosts = posts.map((post) => {
      return new Post({
        title: post.title,
        body: post.body,
        createdDate: post.create_time,
        updatedDate: post.create_time,
      });
    });

    return filterPosts;
  }

  async update(updatePostDto: UpdatePostDto, userId: number, postId: number) {
    await this.findPostById(postId, userId);
    const post = await this.prismaService.post.update({
      where: { id: postId },
      data: updatePostDto,
    });
    return new Post({
      title: post.title,
      body: post.body,
      createdDate: post.create_time,
      updatedDate: post.update_time,
    });
  }

  async delete(postId: number, userId: number) {
    await this.findPostById(postId, userId);
    try {
      await this.prismaService.post.delete({ where: { id: postId } });
      return true;
    } catch (err) {
      throw new BadRequestException({ message: `Could not delete post` });
    }
  }
}
