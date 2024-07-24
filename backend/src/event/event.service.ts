import { HttpException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { EventDto } from './dto/event.dto';

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

  async getMyEvents(userId: string) {
    const whereParams = {
      OR: [
        {
          organizers: {
            some: {
              userId,
            },
          },
        },
        {
          registrations: {
            some: {
              userId,
            },
          },
        },
      ],
    };
    const upcomingEvents = await this.prisma.event.findMany({
      where: {
        AND: [
          whereParams,
          {
            startDate: {
              gte: new Date(),
            },
          },
        ],
      },
    });

    const pastEvents = await this.prisma.event.findMany({
      where: {
        AND: [
          whereParams,
          {
            startDate: {
              lt: new Date(),
            },
          },
        ],
      },
    });

    return {
      upcomingEvents,
      pastEvents,
    };
  }

  async getEventById(id: string, userId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        address: true,
        startDate: true,
        endDate: true,
        isPublic: true,
        useExternalRegistration: true,
        autoAcceptRegistrations: true,
        enableQualifications: true,
        enableGroups: true,
        enableKnockoutStage: true,
        map: true,
        organizers: {
          select: {
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
        },
        registrations: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                username: true,
                fullName: true,
              },
            },
          },
        },
      },
    });
    if (
      event &&
      (event.isPublic || (await this.hasPermissionToManage(event.id, userId)))
    ) {
      return {
        ...event,
        organizers: event.organizers.map((organizer) => organizer.user),
      };
    }
    throw new HttpException('Event not found', 404);
  }

  async createEvent(data: EventDto) {
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

  async updateEvent(id: string, data: EventDto, userId: string) {
    const event = await this.prisma.event.findFirst({
      where: {
        id,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    if (!this.hasPermissionToManage(id, userId)) {
      throw new HttpException(
        'You do not have permission to manage this event',
        403,
      );
    }

    await this.prisma.event.update({
      where: {
        id,
      },
      data: {
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

    await this.prisma.eventOrganizer.deleteMany({
      where: {
        eventId: id,
      },
    });

    await this.prisma.eventOrganizer.createMany({
      data: data.organizers.map((organizer) => ({
        userId: organizer.id,
        eventId: id,
      })),
    });

    return {
      message: 'Event updated successfully',
    };
  }

  async hasPermissionToManage(eventId: string, userId: string) {
    if (!userId) return false;
    const isOrganizer = await this.prisma.eventOrganizer.findFirst({
      where: {
        eventId,
        userId,
      },
    });
    const isAdmin = await this.prisma.user.findFirst({
      where: {
        id: userId,
        role: 'ADMIN',
      },
    });

    return isOrganizer || isAdmin;
  }
}
