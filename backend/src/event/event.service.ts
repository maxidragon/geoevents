import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

@Injectable()
export class EventService {
  constructor(private readonly prisma: DbService) {}

  async getUpcomingEvents() {
    return await this.prisma.event.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
      },
    });
  }
}
