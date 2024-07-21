import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UserService } from './user.service';

@UseGuards(AdminGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('')
  async searchUsers(@Query('search') search: string) {
    return this.userService.searchUsers(search);
  }
}
