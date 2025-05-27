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
import { User, UserRole } from '../entity/user.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { RoleGuard } from '../../auth/roles.guard';
import { CurrentUser } from '../../auth/current-user.decorator';
import { RolePermissions } from '../../auth/roles-hierarchy';
import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';

@ApiTags('Users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, type: [User] })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Post()
  @UseGuards(RoleGuard)
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({ status: 201, type: User })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get('/find')
  @ApiOperation({ summary: 'Find user by email or auth0_id' })
  @ApiResponse({ status: 200, type: User })
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

  @Get('/me')
  @ApiOperation({ summary: 'Get current user info' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({ status: 403, description: 'User not authenticated' })
  async getCurrentUser(@CurrentUser() currentUser: User): Promise<User> {
    if (!currentUser) {
      throw new ForbiddenException('User not authenticated');
    }
    return currentUser;
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
  @ApiOperation({ summary: 'Update user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, type: User })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
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
    return this.usersService.update(id, updateUserDto);
  }

  @Get('/workers')
  @ApiOperation({ summary: 'Get all warehouse workers' })
  @ApiResponse({ status: 200, type: [User] })
  async getWorkers(): Promise<User[]> {
    return this.usersService.findByRole(UserRole.WORKER);
  }

  @Get('/managers')
  @ApiOkResponse({ type: [User] })
  async getManagers(): Promise<User[]> {
    return this.usersService.findByRole(UserRole.MANAGER);
  }

  @Get('/clients')
  @ApiOkResponse({ type: [User] })
  async getCients(): Promise<User[]> {
    return this.usersService.findByRole(UserRole.CLIENT);
  }

  @Delete('user/:id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiParam({ name: 'id', description: 'User UUID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
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
