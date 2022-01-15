import { ExtendRequest } from './../common/type/request.type';
import { JwtAuthGuard } from './jwt-auth.guard';
import { User } from './../user/entities/user.entity';
import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Res,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { AuthService } from './auth.service';
import { UserLogin } from './dto/auth.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() userRegister: CreateUserDto): Promise<User> {
    return await this.authService.register(userRegister);
  }

  @Post('login')
  async login(@Body() userLogin: UserLogin, @Res() res: Response) {
    const token = await this.authService.login(userLogin);
    res.cookie('token', token, { httpOnly: true });
    return res.send({ token: token }).status(HttpStatus.OK);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@Req() req: ExtendRequest) {
    const { username } = req.user;
    return username;
  }
}
