import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from 'src/packages/users/service/users.service';
import { SignUpDTO } from '../dto/signUp.dto';
import { SignInDTO } from '../dto/signIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDTO: SignUpDTO): Promise<any> {
    const foundUser = await this.userService.findByEmail(signUpDTO.email);

    if (foundUser) {
      throw new ConflictException();
    }

    try {
      const createdUser = await this.userService.create({
        email: signUpDTO.email,
        password: signUpDTO.password,
        username: signUpDTO.username,
      });

      const result = createdUser;
      const payload = { sub: result.id, username: result.username };

      return {
        access_token: await this.jwtService.signAsync(payload),
        username: result.username,
        email: result.email,
      };
    } catch {
      throw new HttpException(
        'Error registering account',
        HttpStatus.BAD_GATEWAY,
      );
    }
  }

  async signIn(signInDTO: SignInDTO): Promise<any> {
    const user = await this.userService.findByEmail(signInDTO.email);

    if (!user) {
      throw new NotFoundException();
    }

    if ((await bcrypt.compare(signInDTO.password, user.password)) == false) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username,
      email: user.email,
    };
  }
}
