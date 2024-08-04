import { HttpException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { EventService } from 'src/event/event.service';
import { EnterResultDto } from './dto/enterResult.dto';

@Injectable()
export class QualificationService {
  constructor(
    private readonly prisma: DbService,
    private readonly eventService: EventService,
  ) {}

  async enterOrUpdateResult(
    eventId: string,
    data: EnterResultDto,
    userId: string,
  ) {
    const hasPermission = await this.eventService.hasPermissionToManage(
      eventId,
      userId,
    );
    if (!hasPermission) {
      throw new HttpException(
        'You do not have permission to manage this event',
        403,
      );
    }
    await this.prisma.qualificationResult.upsert({
      create: {
        event: { connect: { id: eventId } },
        registration: { connect: { id: data.registrationId } },
        score: data.score,
        maxScore: data.maxScore,
        totalTime: data.totalTime,
      },
      update: {
        score: data.score,
        maxScore: data.maxScore,
        totalTime: data.totalTime,
      },
      where: {
        eventId_registrationId: {
          eventId,
          registrationId: data.registrationId,
        },
      },
    });

    return {
      message: 'Result entered successfully',
    };
  }

  async deleteResult(id: string, userId: string) {
    const result = await this.prisma.qualificationResult.findUnique({
      where: { id },
      include: { event: true },
    });
    if (!result) {
      throw new HttpException('Result not found', 404);
    }
    const hasPermission = await this.eventService.hasPermissionToManage(
      result.eventId,
      userId,
    );
    if (!hasPermission) {
      throw new HttpException(
        'You do not have permission to manage this event',
        403,
      );
    }
    await this.prisma.qualificationResult.delete({ where: { id } });
    return {
      message: 'Result deleted successfully',
    };
  }
}
