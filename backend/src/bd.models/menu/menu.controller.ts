import { Controller, Get, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CurrentUser } from '../../auth/current-user.decorator';
import { User } from '../entity/user.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
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
}
