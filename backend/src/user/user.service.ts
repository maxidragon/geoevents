import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: DbService) {}

  async searchUsers(search: string) {
    return this.prisma.user.findMany({
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            fullName: {
              contains: search,
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
}
