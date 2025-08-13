import type { Response } from 'express';
import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const id = await this.authService.signup(body.username, body.password);

    return { status: true, id: id };
  }

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { username, password } = body;
    const user = await this.authService.validateUser(username, password);

    if (!user.user) {
      throw new HttpException(
        { error: { root: `${user.message}` } },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return { status: true, id: user.data.id };
  }
}
