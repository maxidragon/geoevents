import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
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
import { TokenGuard } from 'src/auth/guards/token.guard';
import { ExternalRegistrationDto } from './dto/externalRegistration.dto';
import { GetToken } from 'src/auth/decorator/getToken.decorator';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get('upcoming')
  async getUpcomingEvents() {
    return await this.eventService.getUpcomingEvents();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('search')
  async searchEvents(
    @Query('search') search: string,
    @GetUser() user: JwtAuthDto,
  ) {
    return await this.eventService.searchEvents(search, user?.userId);
  }

  @UseGuards(AdminGuard)
  @Post()
  async createEvent(@Body() data: EventDto) {
    return await this.eventService.createEvent(data);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Get(':id/api-key')
  async getApiKey(@Param('id') id: string, @GetUser() user: JwtAuthDto) {
    return await this.eventService.getApiKey(id, user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getEventsOrganizedByMe(@GetUser() user: JwtAuthDto) {
    return await this.eventService.getMyEvents(user.userId);
  }

  @UseGuards(TokenGuard)
  @Post('external/register')
  async registerForEventExternal(
    @Body() data: ExternalRegistrationDto,
    @GetToken() token: string,
  ) {
    return await this.eventService.addRegistration(data, token);
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id/registration/:registrationId')
  async deleteRegistrationForEvent(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: string,
    @Param('registrationId') registrationId: string,
  ) {
    return await this.eventService.deleteRegistration(
      id,
      registrationId,
      user.userId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/registration/:registrationId/accept')
  async acceptRegistrationForEvent(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: string,
    @Param('registrationId') registrationId: string,
  ) {
    return await this.eventService.acceptRegistration(
      id,
      registrationId,
      user.userId,
    );
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/registration/:registrationId/pending')
  async moveRegistrationToPending(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: string,
    @Param('registrationId') registrationId: string,
  ) {
    return await this.eventService.moveRegistrationToPending(
      id,
      registrationId,
      user.userId,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async getEventById(
    @GetUser() user: JwtAuthDto,
    @Param('id') id: string,
    @Query('isPublic') isPublic: boolean = true,
  ) {
    return await this.eventService.getEventById(id, user.userId, isPublic);
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
