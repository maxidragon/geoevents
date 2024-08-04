import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/decorator/getUser.decorator';
import { JwtAuthDto } from '../auth/dto/jwt-auth.dto';
import { EnterResultDto } from './dto/enterResult.dto';
import { QualificationService } from './qualification.service';

@Controller('qualification')
export class QualificationController {
  constructor(private readonly qualificationService: QualificationService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':id/result')
  async enterResult(
    @Param('id') eventId: string,
    @Body() data: EnterResultDto,
    @GetUser() user: JwtAuthDto,
  ) {
    return this.qualificationService.enterOrUpdateResult(
      eventId,
      data,
      user.userId,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteResult(@Param('id') id: string, @GetUser() user: JwtAuthDto) {
    return this.qualificationService.deleteResult(id, user.userId);
  }
}
