import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DbService) {}

  async getUsers(search: string, page: string) {
    const perPage = 10;
    const skip = (parseInt(page) - 1) * perPage;
    const whereParams = {};
    if (search) {
      whereParams['OR'] = [
        {
          username: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          fullName: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }
    const users = await this.prisma.user.findMany({
      where: whereParams,
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        createdAt: true,
        confirmedAt: true,
        role: true,
      },
      skip,
      take: perPage,
    });
    const totalUsers = await this.prisma.user.count({
      where: whereParams,
    });
    return {
      users,
      totalItems: totalUsers,
      totalPages: Math.ceil(totalUsers / perPage),
    };
  }
  async searchUsers(search: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            fullName: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      },
      select: {
        id: true,
        username: true,
        fullName: true,
        email: true,
        createdAt: true,
        confirmedAt: true,
        role: true,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        username: data.username,
        fullName: data.fullName,
        email: data.email,
        role: data.role,
      },
    });
  }

  async deleteUser(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }
}
