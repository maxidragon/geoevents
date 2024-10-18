import { sha512 } from 'js-sha512';
import { HttpException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { EventDto } from './dto/event.dto';
import {
  QualificationResult,
  RegistrationAction,
  RegistrationStatus,
} from '@prisma/client';
import { RegisterDto } from './dto/register.dto';
import { ExternalRegistrationDto } from './dto/externalRegistration.dto';
import * as crypto from 'crypto';

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

  async searchEvents(search: string, userId: string) {
    if (userId) {
      const isAdmin = await this.prisma.user.findFirst({
        where: {
          id: userId,
          role: 'ADMIN',
        },
      });

      if (isAdmin) {
        return await this.prisma.event.findMany({
          where: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        });
      }
    }
    return await this.prisma.event.findMany({
      where: {
        AND: [
          {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            OR: [
              {
                organizers: {
                  some: {
                    userId,
                  },
                },
              },
              {
                isPublic: true,
              },
            ],
          },
        ],
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

  async getEventById(id: string, userId: string, isPublic: boolean) {
    const hasPermission = await this.hasPermissionToManage(id, userId);
    const registrationsWhereParams = isPublic
      ? { status: RegistrationStatus.ACCEPTED }
      : hasPermission
        ? {}
        : { status: RegistrationStatus.ACCEPTED };
    const registrationHistorySelect = {
      select: {
        id: true,
        action: true,
        timestamp: true,
        performedBy: {
          select: {
            id: true,
            username: true,
            fullName: true,
          },
        },
      },
    };
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
        registrationOpen: true,
        registrationClose: true,
        isPublic: true,
        useExternalRegistration: true,
        autoAcceptRegistrations: true,
        enableQualifications: true,
        enableGroups: true,
        enableKnockoutStage: true,
        proceedFromQualifications: true,
        limit: true,
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
        QualificationResult: {
          select: {
            id: true,
            eventId: true,
            registrationId: true,
            score: true,
            maxScore: true,
            totalTime: true,
            registration: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    fullName: true,
                  },
                },
                comment: hasPermission ? true : false,
              },
            },
          },
        },
        registrations: {
          select: {
            id: true,
            eventId: true,
            comment: hasPermission ? true : false,
            user: {
              select: {
                id: true,
                username: true,
                email: hasPermission ? true : false,
                fullName: true,
              },
            },
            status: true,
            registrationHistory: hasPermission
              ? isPublic
                ? false
                : registrationHistorySelect
              : false,
          },
          where: registrationsWhereParams,
        },
      },
    });
    if (
      event &&
      (event.isPublic || (await this.hasPermissionToManage(event.id, userId)))
    ) {
      return {
        ...event,
        qualificationResults: this.orderQualificationResults(
          event.QualificationResult,
        ),
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
        limit: data.limit,
        enableGroups: data.enableGroups,
        enableKnockoutStage: data.enableKnockoutStage,
        registrationOpen: data.registrationOpen,
        registrationClose: data.registrationClose,
        proceedFromQualifications: data.proceedFromQualifications,
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
        limit: data.limit,
        isPublic: data.isPublic,
        useExternalRegistration: data.useExternalRegistration,
        autoAcceptRegistrations: data.autoAcceptRegistrations,
        enableQualifications: data.enableQualifications,
        enableGroups: data.enableGroups,
        enableKnockoutStage: data.enableKnockoutStage,
        registrationOpen: data.registrationOpen,
        registrationClose: data.registrationClose,
        proceedFromQualifications: data.proceedFromQualifications,
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

  async registerForEvent(eventId: string, userId: string, data: RegisterDto) {
    const event = await this.prisma.event.findFirst({
      where: {
        id: eventId,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    if (event.useExternalRegistration) {
      throw new HttpException('This event requires external registration', 400);
    }

    const registration = await this.prisma.registration.create({
      data: {
        eventId,
        userId,
        comment: data.comment,
        status: RegistrationStatus.PENDING,
        registrationHistory: {
          create: {
            action: RegistrationAction.CREATED,
            performedBy: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });

    if (event.autoAcceptRegistrations) {
    } else {
      const registrationsCount = await this.prisma.registration.count({
        where: {
          eventId,
          status: RegistrationStatus.ACCEPTED,
        },
      });
      if (registrationsCount <= event.limit || event.limit === 0) {
        await this.prisma.registration.update({
          where: {
            id: registration.id,
          },
          data: {
            status: RegistrationStatus.ACCEPTED,
            registrationHistory: {
              create: {
                action: RegistrationAction.ACCEPTED,
                performedBy: {
                  connect: {
                    id: userId,
                  },
                },
              },
            },
          },
        });
      }
    }
    return {
      message: 'Successfully registered for event',
    };
  }

  async addRegistration(dto: ExternalRegistrationDto, apiKey: string) {
    const apiKeyFromDb = await this.prisma.apiKey.findUnique({
      where: {
        key: sha512(apiKey).toString(),
      },
    });
    if (!apiKeyFromDb) {
      throw new HttpException('Invalid API key', 403);
    }

    const event = await this.prisma.event.findFirst({
      where: {
        id: apiKeyFromDb.eventId,
      },
    });

    if (!event) {
      throw new HttpException('Event not found', 404);
    }

    if (!event.useExternalRegistration) {
      throw new HttpException(
        'This event does not allow external registration',
        400,
      );
    }

    const user = await this.prisma.user.upsert({
      where: {
        email: dto.email,
      },
      update: {
        username: dto.username,
        fullName: dto.fullName,
      },
      create: {
        email: dto.email,
        username: dto.username,
        fullName: dto.fullName,
        password: 'dummy-password',
      },
    });

    await this.prisma.registration.create({
      data: {
        eventId: event.id,
        userId: user.id,
        comment: dto.comment,
        status: RegistrationStatus.PENDING,
        registrationHistory: {
          create: {
            action: RegistrationAction.CREATED,
            performedBy: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },
    });

    return {
      message: 'Successfully registered for event',
    };
  }

  async getApiKey(eventId: string, userId: string) {
    if (!(await this.hasPermissionToManage(eventId, userId))) {
      throw new HttpException(
        'You do not have permission to manage this event',
        403,
      );
    }

    await this.prisma.apiKey.deleteMany({
      where: {
        eventId,
      },
    });

    const apiKey = crypto.randomBytes(32).toString('hex');
    await this.prisma.apiKey.create({
      data: {
        key: sha512(apiKey).toString(),
        generatedBy: {
          connect: {
            id: userId,
          },
        },
        event: {
          connect: {
            id: eventId,
          },
        },
      },
    });
    return {
      apiKey,
    };
  }

  async getRegistration(eventId: string, userId: string) {
    const registration = await this.prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
      include: {
        registrationHistory: true,
      },
    });
    if (!registration) {
      throw new HttpException('Registration not found', 404);
    }
    return registration;
  }

  async updateRegistration(eventId: string, userId: string, data: RegisterDto) {
    const registration = await this.prisma.registration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId,
        },
      },
    });

    if (!registration) {
      throw new HttpException('Registration not found', 404);
    }

    await this.prisma.registration.update({
      where: {
        id: registration.id,
      },
      data: {
        comment: data.comment,
      },
    });

    return {
      message: 'Registration updated successfully',
    };
  }

  async acceptRegistration(
    eventId: string,
    registrationId: string,
    userId: string,
  ) {
    const hasPermission = await this.hasPermissionToManage(eventId, userId);

    if (!hasPermission) {
      throw new HttpException(
        'You do not have permission to manage this event',
        403,
      );
    }

    const registration = await this.prisma.registration.findUnique({
      where: {
        id: registrationId,
      },
    });

    if (!registration) {
      throw new HttpException('Registration not found', 404);
    }

    const acceptedRegistrations = await this.prisma.registration.count({
      where: {
        eventId,
        status: RegistrationStatus.ACCEPTED,
      },
    });
    const event = await this.prisma.event.findUnique({
      where: {
        id: eventId,
      },
    });
    if (acceptedRegistrations >= event.limit && event.limit > 0) {
      throw new HttpException(
        'Event has reached the maximum number of participants',
        400,
      );
    }

    await this.prisma.registration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: RegistrationStatus.ACCEPTED,
        registrationHistory: {
          create: {
            action: RegistrationAction.ACCEPTED,
            performedBy: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
    return {
      message: 'Registration accepted',
    };
  }

  async deleteRegistration(
    eventId: string,
    registrationId: string,
    userId: string,
  ) {
    const hasPermission = await this.hasPermissionToManage(eventId, userId);

    if (!hasPermission) {
      throw new HttpException(
        'You do not have permission to manage this event',
        403,
      );
    }

    const registration = await this.prisma.registration.findUnique({
      where: {
        id: registrationId,
      },
    });

    if (!registration || registration.status === RegistrationStatus.DELETED) {
      throw new HttpException('Registration not found', 404);
    }

    return await this.prisma.registration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: RegistrationStatus.DELETED,
        registrationHistory: {
          create: {
            action: RegistrationAction.DELETED,
            performedBy: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
  }

  async moveRegistrationToPending(
    eventId: string,
    registrationId: string,
    userId: string,
  ) {
    const hasPermission = await this.hasPermissionToManage(eventId, userId);

    if (!hasPermission) {
      throw new HttpException(
        'You do not have permission to manage this event',
        403,
      );
    }

    const registration = await this.prisma.registration.findUnique({
      where: {
        id: registrationId,
      },
    });

    if (!registration) {
      throw new HttpException('Registration not found', 404);
    }

    return await this.prisma.registration.update({
      where: {
        id: registrationId,
      },
      data: {
        status: RegistrationStatus.PENDING,
        registrationHistory: {
          create: {
            action: RegistrationAction.MOVED_TO_PENDING,
            performedBy: {
              connect: {
                id: userId,
              },
            },
          },
        },
      },
    });
  }

  orderQualificationResults(results: QualificationResult[]) {
    return results.sort((a, b) => {
      if (a.score > b.score) {
        return -1;
      } else if (a.score < b.score) {
        return 1;
      } else {
        if (a.maxScore > b.maxScore) {
          return -1;
        } else if (a.maxScore < b.maxScore) {
          return 1;
        } else {
          if (a.totalTime < b.totalTime) {
            return -1;
          } else if (a.totalTime > b.totalTime) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    });
  }
}
