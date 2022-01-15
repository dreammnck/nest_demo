import { ExtendRequest } from './../common/type/request.type';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get(':id')
  async getPost(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: ExtendRequest,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const post = await this.postService.findPostById(id, userId);
    return res.send(post).status(HttpStatus.OK);
  }

  @Get()
  async getAllPost(@Req() req: ExtendRequest, @Res() res: Response) {
    const { id } = req.user;
    const posts = await this.postService.findMany(id);
    return res.send(posts).status(HttpStatus.OK);
  }

  @Post()
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: ExtendRequest,
    @Res() res: Response,
  ) {
    const { id } = req.user;
    const post = await this.postService.create(createPostDto, id);
    return res.send(post).status(HttpStatus.CREATED);
  }

  @Patch(':id')
  async update(
    @Body() updatePostDto: UpdatePostDto,
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: ExtendRequest,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const post = await this.postService.update(updatePostDto, userId, id);
    return res.send(post).status(HttpStatus.CREATED);
  }

  @Delete(':id')
  async delete(
    @Param('id', new ParseIntPipe()) id: number,
    @Req() req: ExtendRequest,
    @Res() res: Response,
  ) {
    const userId = req.user.id;
    const status = await this.postService.delete(id, userId);
    return res.send(status).status(HttpStatus.NO_CONTENT);
  }
}
