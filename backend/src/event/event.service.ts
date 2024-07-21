import { HttpException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateEventDto } from './dto/createEvent.dto';

@Injectable()
export class EventService {
  constructor(private readonly prisma: DbService) {}

  async getUpcomingEvents() {
    return await this.prisma.event.findMany({
      where: {
        startDate: {
          gte: new Date(),
        },
        isPublic: true,
      },
    });
  }

  async createEvent(data: CreateEventDto) {
    const existingEvent = await this.prisma.event.findFirst({
      where: {
        id: data.id,
      },
    });
    if (existingEvent) {
      throw new HttpException('Event with this ID already exists', 409);
    }
    const event = await this.prisma.event.create({
      data: {
        id: data.id || undefined,
        name: data.name,
        address: data.address,
        startDate: data.startDate,
        endDate: data.endDate,
        isPublic: data.isPublic,
        useExternalRegistration: data.useExternalRegistration,
        autoAcceptRegistrations: data.autoAcceptRegistrations,
        enableQualifications: data.enableQualifications,
        enableGroups: data.enableGroups,
        enableKnockoutStage: data.enableKnockoutStage,
      },
    });
    await this.prisma.eventOrganizer.createMany({
      data: data.organizers.map((organizer) => ({
        userId: organizer.id,
        eventId: event.id,
      })),
    });
    return {
      message: 'Event created successfully',
      data: event,
    };
  }
}
