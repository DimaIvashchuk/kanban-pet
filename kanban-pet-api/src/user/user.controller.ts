import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Get, Post, Put, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update.dto';
import { UserPlain } from './user.types';

@Controller({ path: 'user', version: '1' })
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserPlain[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserPlain> {
    return this.userService.findOne(id);
  }

  @Post()
  async create(@Body() user: User): Promise<UserPlain> {
    return this.userService.create(user);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() user: UpdateUserDto,
  ): Promise<UserPlain> {
    return this.userService.update(id, user);
  }

  // @Delete(':id')
  // async remove(@Param('id') id: number): Promise<void> {
  //   return this.userService.remove(id);
  // }
}
