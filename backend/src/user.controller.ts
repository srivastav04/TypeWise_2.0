import {
  BadRequestException,
  Body,
  Controller,
  Get,
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

@Controller('user')
export class UserController {
  constructor(
    private authService: AuthService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('data')
  async handleData(
    @Body() body: { wpm: string; accuracy: string; id: string },
    @Req() req: any,
  ) {
    const { accuracy, wpm, id } = body;

    const userData = await this.prisma.user.findUnique({
      where: { userId: id },
    });
    if (userData) {
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
        where: { userId: id },
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

  @Get('data/:id')
  async handleGetData(@Req() req: any, @Param('id') id: string) {
    const data = await this.prisma.user.findUnique({
      where: { userId: id },
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
