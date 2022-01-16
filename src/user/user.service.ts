import { ConfigService } from '@nestjs/config';
import { User } from './entities/user.entity';
import { PrismaService } from '../prisma/prisma.service';
import {
  Injectable,
  UnprocessableEntityException,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const user = await this.prismaService.user.create({
        data: createUserDto,
      });
      return new User({
        username: user.username,
        createdDate: user.create_time,
      });
    } catch (err) {
      throw new BadRequestException({
        message: 'This username has already in use',
      });
    }
  }

  async findById(id: number) {
    const user = await this.prismaService.user.findFirst({ where: { id: id } });
    if (user) {
      return new User({
        username: user.username,
        createdDate: user.create_time,
      });
    }
    throw new BadRequestException({ message: `Could not find user's${id}` });
  }

  async findByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) {
      throw new BadRequestException({ message: `Could not find user` });
    }
    
    return new User({
      id: user.id,
      username: user.username,
      password: user.password,
      createdDate: user.create_time,
    });
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const { password, username } = updateUserDto;
    const hashPassword = await bcrypt.hash(
      password,
      this.configService.get<number>('salt'),
    );
    const user = await this.prismaService.user.update({
      where: { id },
      data: { username, password: hashPassword },
    });

    return new User({
      username: user.username,
      createdDate: user.create_time,
      updatedDate: user.update_time,
    });
  }

  async delete(id: number, username: string) {
    try {
      return await this.prismaService.user.delete({
        where: { id: id, username: username },
      });
    } catch (err) {
      throw new UnprocessableEntityException({
        message: 'Unsuccesfully delete',
      });
    }
  }
}
