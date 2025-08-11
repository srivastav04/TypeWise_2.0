import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './prisma/prisma.service';
import { error } from 'console';

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('data')
  async handleData(
    @Body() body: { wpm: string; accuracy: string },
    @Req() req: any,
  ) {
    const { accuracy, wpm } = body;
    const token = req.cookies['token'];
    const decoded = await this.authService.verifyToken(token);
    console.log('decoded', decoded);
    console.log('body', body);
    const userData = await this.prisma.user.findUnique({
      where: { userId: decoded.sub },
    });
    console.log('uesr', userData);
    if (userData && decoded) {
      const newScores = [...userData.scores, Number(wpm)];
      const newAccuracy = [...userData.accuracy, Number(accuracy)];
      const newTotalTests = userData.totalTests + 1;
      const newAverageScore =
        (userData.averageScore * userData.totalTests + Number(wpm)) /
        newTotalTests;
      const newAverageAccuracy =
        (userData.averageAccuracy * userData.totalTests + Number(accuracy)) /
        newTotalTests;

      await this.prisma.user.update({
        where: { userId: decoded.sub },
        data: {
          totalTests: newTotalTests,
          scores: newScores,
          accuracy: newAccuracy,
          averageScore: newAverageScore,
          averageAccuracy: newAverageAccuracy,
        },
      });
    } else {
      throw new HttpException(
        { error: { error: "User does'nt exist" } },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return { message: 'Data received' };
  }

  @Get('data')
  async handleGetData(@Req() req: any) {
    const token = req.cookies['token'];
    const decoded = await this.authService.verifyToken(token);
    console.log('decoded', decoded);
    console.log('Expires at:', new Date(decoded.exp * 1000).toUTCString());

    const data = await this.prisma.user.findUnique({
      where: { userId: decoded.sub },
    });
    if (data) return { data };
    else
      throw new HttpException(
        { error: { error: "user doesn't exists" } },
        HttpStatus.UNAUTHORIZED,
      );
  }

  @Get('/search')
  async searchUsers(@Query('query') query: string) {
    if (!query || !query.trim()) {
      throw new BadRequestException('Query parameter is required');
    }

    try {
      const users = await this.prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: query, mode: 'insensitive' } },
            { username: { startsWith: query, mode: 'insensitive' } },
            { username: { endsWith: query, mode: 'insensitive' } },
          ],
        },
        select: {
          id: true,
          userId: true,
          username: true,
          avatar: true,
        },
        take: 10,
      });

      return { users };
    } catch (error) {
      console.error('User search error:', error);
      throw new InternalServerErrorException('Server error');
    }
  }
  @Get('/data/:userId')
  async getUserPosts(@Param('userId') userId: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { userId },
      });

      if (!user) {
        return { status: false, message: 'User not found' };
      }

      return {
        data: user,
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to get user posts');
    }
  }
}
