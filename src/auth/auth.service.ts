import { PrismaService } from './../prisma/prisma.service';
import { User } from './../user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { UserService } from './../user/user.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserLogin } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService
  ) {}

  async register(userRegister: CreateUserDto): Promise<User> {
    const { password, username } = userRegister;
    const hashPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('salt'),
    );
    const user = await this.userService.create({
      username: username,
      password: hashPassword,
    });
    return user;
  }

  async login(userLogin: UserLogin) {
    const { username, password } = userLogin;

      const user = await this.prismaService.user.findFirst({
        where: {
          username,
        }
      });
      if (!user) {
        throw new BadRequestException({ message: `Please sign up` });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException({
          message: `Username/Passowrd is invalid`,
        });
      }
      const token = this.createToken({ username: username, id: user.id });
      return token;

  }

  createToken(payload: { username: string; id: number }) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
