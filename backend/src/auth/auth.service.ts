import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

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

    await this.prisma.user.create({
      data: {
        userId: id,
        username,
        password: hashedPassword.toString(),
        avatar: `https://api.dicebear.com/7.x/adventurer-neutral/svg?seed=${username}`,
      },
    });

    // Use JwtModule defaults (secret + signOptions configured in module)
    const token = this.jwtService.sign({
      sub: id,
      username: username,
    });

    console.log('token', token);

    return { access_token: token };
  }

  async verifyToken(token: string) {
    try {
      if (!token) return null;
      console.log('token', token);
      console.log('JWT_SECRET present?', !!process.env.JWT_SECRET);

      // Use module-configured verification (will throw on invalid/expired)
      return this.jwtService.verify(token);
    } catch (err: any) {
      // Distinguish expired tokens from other errors
      if (err.name === 'TokenExpiredError') {
        console.error(
          'JWT verify error: TokenExpiredError, expiredAt =',
          err.expiredAt,
        );
      } else {
        console.error('JWT verify error:', err);
      }
      return null;
    }
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

  async login(user: any) {
    const payload = { sub: user.id, username: user.username };

    // Use JwtModule defaults so signOptions (expiresIn) are applied
    const access_token = this.jwtService.sign(payload);

    return { access_token };
  }
}
