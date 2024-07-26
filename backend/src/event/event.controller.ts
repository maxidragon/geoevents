import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { EventService } from './event.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { EventDto } from './dto/event.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator/getUser.decorator';
import { JwtAuthDto } from 'src/auth/dto/jwt-auth.dto';
import { OptionalJwtAuthGuard } from 'src/auth/guards/optionalJwt.guard';
import { RegisterDto } from './dto/register.dto';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('upcoming')
  async getUpcomingEvents() {
    return await this.eventService.getUpcomingEvents();
  }

  @UseGuards(AdminGuard)
  @Post()
  async createEvent(@Body() data: EventDto) {
    return await this.eventService.createEvent(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getEventsOrganizedByMe(@GetUser() user: JwtAuthDto) {
    return await this.eventService.getMyEvents(user.userId);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/register')
  async registerForEvent(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: string,
    @Body() data: RegisterDto,
  ) {
    return await this.eventService.registerForEvent(id, user.userId, data);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id/registration')
  async getRegistrationForEvent(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: string,
  ) {
    return await this.eventService.getRegistration(id, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/registration')
  async updateRegistrationForEvent(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: string,
    @Body() data: RegisterDto,
  ) {
    return await this.eventService.updateRegistration(id, user.userId, data);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async getEventById(@GetUser() user: JwtAuthDto, @Param('id') id: string) {
    return await this.eventService.getEventById(id, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async updateEvent(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: string,
    @Body() data: EventDto,
  ) {
    return await this.eventService.updateEvent(id, data, user.userId);
  }
}
