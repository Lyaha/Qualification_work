import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../bd.models/entity/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  getMenu(@CurrentUser() user: User) {
    return this.menuService.getMenuForUser(user);
  }

  @Get('check-access')
  checkAccess(@CurrentUser() user: User, @Query('path') path: string) {
    return { hasAccess: this.menuService.checkAccess(user, path) };
  }
}
