import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signup(username: string, password: string) {
    const existing = await this.prisma.user.findUnique({
      where: { username },
    });

    if (existing) {
      throw new HttpException(
        { error: { username: 'User already exists' } },
        HttpStatus.UNAUTHORIZED,
      );
    }

    const id = randomUUID().slice(0, 4);
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        userId: id,
        username,
        password: hashedPassword.toString(),
        avatar: `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${username}`,
      },
    });

    return user.userId;
  }

  async validateUser(username: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    if (!user) return { user: null, message: 'User not found.' };
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return { user: null, message: 'Incorrect username or password.' };
    } else
      return {
        user: true,
        data: {
          id: user.userId,
          username,
        },
      };
  }
}
