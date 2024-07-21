import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { CreateEventDto } from './dto/createEvent.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from 'src/auth/dto/jwt-auth.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('upcoming')
  async getUpcomingEvents() {
    return await this.eventService.getUpcomingEvents();
  }

  @UseGuards(AdminGuard)
  @Post()
  async createEvent(@Body() data: CreateEventDto) {
    return await this.eventService.createEvent(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getEventsOrganizedByMe(@GetUser() user: JwtAuthDto) {
    return await this.eventService.getMyEvents(user.userId);
  }
}
