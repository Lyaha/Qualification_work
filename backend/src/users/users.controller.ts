import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<User>): Promise<User> {
    return this.usersService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: Partial<User>): Promise<User> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }

  @Get('/find')
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'auth0_id', required: false })
  @ApiOkResponse({ type: User })
  async findByParam(
    @Query('email') email?: string,
    @Query('auth0_id') auth0_id?: string,
  ): Promise<User> {
    return this.usersService.findByParam(email, auth0_id);
  }
}
