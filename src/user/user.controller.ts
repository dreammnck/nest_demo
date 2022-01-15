import { ExtendRequest } from './../common/type/request.type';
import { JwtAuthGuard } from './../auth/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { Response } from 'express';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const user = await this.userService.create(createUserDto);
    return res.send(user).status(HttpStatus.CREATED);
  }

  @Get()
  async getUser(@Req() req: ExtendRequest, @Res() res: Response) {
    const { username, id } = req.user;
    console.log(username, id);

    const user = await this.userService.findById(id);
    return res.send(user).status(HttpStatus.OK);
  }

  @Patch()
  async updateUser(
    @Req() req: ExtendRequest,
    @Res() res: Response,
    updateUserDto: UpdateUserDto,
  ) {
    const { id } = req.user;
    const user = await this.userService.updateUser(id, updateUserDto);
    return res.send(user).status(HttpStatus.OK);
  }

  @Delete()
  async deleteUser(@Req() req: ExtendRequest, @Res() res: Response) {
    const { id, username } = req.user;
    await this.userService.delete(id, username);
    return res.send(true).status(HttpStatus.NO_CONTENT);
  }
}
