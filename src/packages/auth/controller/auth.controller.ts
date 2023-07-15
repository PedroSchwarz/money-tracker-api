import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { SignUpDTO } from '../dto/signUp.dto';
import { SignInDTO } from '../dto/signIn.dto';
import { AuthGuard, AuthenticatedRequest } from '../guard/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('create')
  signUn(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDTO: SignInDTO) {
    return this.authService.signIn(signInDTO);
  }

  @UseGuards(AuthGuard)
  @Get('verify')
  verifyToken(@Request() req: AuthenticatedRequest) {
    return req.user;
  }
}
