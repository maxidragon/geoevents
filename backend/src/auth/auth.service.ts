import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthDto } from './dto/jwt-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { sha512 } from 'js-sha512';
import { MailerService } from '@nestjs-modules/mailer';
import { TokenType } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: DbService,
    private readonly mailerService: MailerService,
    private readonly jwtService: JwtService,
  ) {}

  async isTaken(email: string, username: string): Promise<boolean> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email,
          },
          {
            username,
          },
        ],
      },
    });
    return !!user;
  }

  async register(dto: RegisterDto): Promise<object> {
    if (await this.isTaken(dto.email, dto.username)) {
      throw new HttpException('Email or username already taken', 409);
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        username: dto.username,
        fullName: dto.fullName,
        password: sha512(dto.password),
      },
    });

    await this.sendVerificationEmail(user.id);

    return { msg: 'Successfully registered a new account!' };
  }

  async sendVerificationEmail(userId: string) {
    const tokenHash = sha512(Math.random() + new Date().getTime().toString());
    const token = await this.prisma.token.upsert({
      where: {
        userId_type: {
          userId: userId,
          type: TokenType.VERIFICATION,
        },
      },
      create: {
        userId: userId,
        type: TokenType.VERIFICATION,
        token: tokenHash,
        expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      },
      update: {
        token: tokenHash,
        expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      },
    });
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    const emailHTML = `
      <html lang="en">
        <body>
          <h1>Verify your email</h1>
          <p>Click <a href="${process.env.FRONTEND_URL}/auth/verify/${token.token}">here</a> to verify your email.</p>
        </body>
      </html>
    `;
    await this.mailerService.sendMail({
      to: user.email,
      from: process.env.MAIL_FROM,
      subject: 'Verify your email',
      html: emailHTML,
    });
  }

  async login(dto: LoginDto): Promise<object> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || (user && !(sha512(dto.password) === user.password))) {
      throw new HttpException('Wrong credentials!', 403);
    }
    if (!user.confirmedAt) {
      await this.sendVerificationEmail(user.id);
      return {
        message:
          'Email not verified. We have sent you an email with a link to verify your email.',
      };
    }
    const jwt = await this.generateAuthJwt({
      userId: user.id,
      role: user.role,
    });

    return {
      token: jwt,
      userInfo: await this.getUserPublicInfoById(user.id),
    };
  }

  async verifyEmail(token: string) {
    const tokenFromDb = await this.prisma.token.findFirst({
      where: {
        token: token,
        type: TokenType.VERIFICATION,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    if (!tokenFromDb) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    await this.prisma.user.update({
      where: {
        id: tokenFromDb.userId,
      },
      data: {
        confirmedAt: new Date(),
      },
    });
    await this.prisma.token.delete({
      where: {
        token: token,
      },
    });
    return {
      message: 'Email verified',
    };
  }

  async generateAuthJwt(payload: JwtAuthDto): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async validateJwt(token: string): Promise<JwtAuthDto> {
    return await this.jwtService.verifyAsync(token);
  }

  async getUserPublicInfoById(id: string): Promise<object | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
      },
    });
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (sha512(oldPassword) !== user.password) {
      throw new HttpException('Wrong password', HttpStatus.FORBIDDEN);
    }
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: sha512(newPassword),
      },
    });
    return 'Password changed';
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    const resetId = sha512(Math.random() + new Date().getTime().toString());
    await this.prisma.token.upsert({
      where: {
        userId_type: {
          userId: user.id,
          type: TokenType.PASSWORD_RESET,
        },
      },
      create: {
        userId: user.id,
        type: TokenType.PASSWORD_RESET,
        token: resetId,
        expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      },
      update: {
        token: resetId,
        expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24),
      },
    });
    if (user) {
      const emailHTML = `
      <html lang="en">
        <body>
          <h1>Reset your password</h1>
          <p>Click <a href="${process.env.FRONTEND_URL}/auth/password/reset/${resetId}">here</a> to reset your password.</p>
        </body>
      </html>
    `;
      await this.mailerService.sendMail({
        to: email,
        from: process.env.MAIL_FROM,
        subject: 'Reset your password',
        html: emailHTML,
      });
    }
    return {
      message:
        "If you've entered a valid email, you'll receive an email with instructions to reset your password.",
    };
  }

  async resetPassword(token: string, newPassword: string) {
    const tokenFromDb = await this.prisma.token.findFirst({
      where: {
        token: token,
        type: TokenType.PASSWORD_RESET,
        expiresAt: {
          gt: new Date(),
        },
      },
    });
    if (!tokenFromDb) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }
    await this.prisma.user.update({
      where: {
        id: tokenFromDb.userId,
      },
      data: {
        password: sha512(newPassword),
      },
    });
    return 'Password changed';
  }

  async internalVerifyToken(token: string) {
    const apiKey = await this.prisma.apiKey.findFirst({
      where: {
        key: sha512(token).toString(),
      },
    });

    return !!apiKey;
  }
}
