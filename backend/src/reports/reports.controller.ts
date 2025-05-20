import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('sales')
  async getSales(
    @Query('start') start: string,
    @Query('end') end: string,
    @Query('warehouse') warehouse: string,
  ) {
    return this.reportsService.getSalesReport(start, end, warehouse);
  }

  @Get('inventory')
  async getInventory() {
    return this.reportsService.getInventoryReport();
  }

  @Get('tasks')
  async getTasks() {
    return this.reportsService.getTasksReport();
  }
}
