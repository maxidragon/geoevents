import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/updateUser.dto';

@UseGuards(AdminGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async searchUsers(@Query('search') search: string) {
    return this.userService.searchUsers(search);
  }

  @Get('admin')
  async getUsers(@Query('page') page: string, @Query('search') search: string) {
    return this.userService.getUsers(search, page);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
