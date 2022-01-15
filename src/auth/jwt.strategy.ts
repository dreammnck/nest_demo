import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { Request } from 'express';

const extractor = (req: Request) => {
  let token = undefined;
  if (req && req.cookies) {
    token = req.cookies['token'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extractor]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('secret'),
    });
  }

  // decode token
  async validate(token: Partial<User>) {
    return { username: token.username, id: token.id };
  }
}
