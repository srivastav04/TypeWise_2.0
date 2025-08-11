import type { Response } from 'express';
import {
  Controller,
  Post,
  Body,
  Get,
  Headers,
  Res,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Req,
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
    const { username } = body;
    const token = await this.authService.signup(body.username, body.password);

    res.cookie('token', token.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return { message: 'Signup success', username: username };
  }

  @Get('profile')
  async getProfile(@Headers('authorization') auth: string) {
    const token = auth?.split(' ')[1];
    const user = await this.authService.verifyToken(token);
    if (!user) throw new Error('Invalid token');
    return { message: `Hello ${user.username}` };
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

    const { access_token } = await this.authService.login(user.data);

    res.cookie('token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return { message: 'Login successful', username: username };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token'); // This clears the HttpOnly cookie
    return { message: 'Logged out successfully' };
  }
}
