import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../entity/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { RoleGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { RolePermissions } from '../auth/roles-hierarchy';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RoleGuard)
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @UseGuards(RoleGuard)
  create(@Body() data: Partial<User>): Promise<User> {
    return this.usersService.create(data);
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

  @Get('/auth-staff')
  async AuthStaff(@Req() req: any, @CurrentUser() currentUser: any): Promise<Boolean> {
    //console.log('Current user:', currentUser);
    try {
      if (!currentUser) {
        throw new ForbiddenException('User not found');
      }
      if (currentUser.role == 'client') {
        return false;
      }
      await this.usersService.update(currentUser.id, { last_login_at: new Date(Date.now()) });
      return true;
    } catch (error) {
      console.error('Error updating last login time:', error);
      throw new ForbiddenException('Failed to update last login time');
    }
  }

  @Get('/user/:id')
  async findOne(@Param('id') id: string, @CurrentUser() currentUser: User): Promise<User> {
    const targetUser = await this.usersService.findOne(id);
    if (!targetUser) {
      throw new ForbiddenException(
        'User not found or you do not have permission to view this user',
      );
    }
    if (currentUser.id !== targetUser.id) {
      const allowedRoles = RolePermissions[currentUser.role];
      if (!allowedRoles.includes(targetUser.role)) {
        throw new ForbiddenException('You do not have permission to view this user');
      }
    }
    return targetUser;
  }

  @Put('/user/:id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<User>,
    @CurrentUser() currentUser: User,
  ): Promise<User> {
    const targetUser = await this.usersService.findOne(id);
    if (!targetUser) {
      throw new ForbiddenException(
        'User not found or you do not have permission to edit this user',
      );
    }
    if (currentUser.id !== targetUser.id) {
      const allowedRoles = RolePermissions[currentUser.role];
      if (!allowedRoles.includes(targetUser.role)) {
        throw new ForbiddenException('You do not have permission to edit this user');
      }
    }
    return this.usersService.update(id, data);
  }

  @Delete('user/:id')
  async remove(@Param('id') id: string, @CurrentUser() currentUser: User): Promise<void> {
    const targetUser = await this.usersService.findOne(id);
    if (!targetUser) {
      throw new ForbiddenException(
        'User not found or you do not have permission to delete this user',
      );
    }
    if (currentUser.id !== targetUser.id) {
      const allowedRoles = RolePermissions[currentUser.role];
      if (!allowedRoles.includes(targetUser.role)) {
        throw new ForbiddenException('You do not have permission to delete this user');
      }
    }
    return this.usersService.remove(id);
  }
}
