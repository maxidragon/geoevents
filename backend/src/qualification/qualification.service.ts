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
}
