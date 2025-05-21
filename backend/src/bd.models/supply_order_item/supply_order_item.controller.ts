import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { SupplyOrderItemService } from './supply_order_item.service';
import { SupplyOrderItem } from '../entity/supply_order_item.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('supply-order-item')
export class SupplyOrderItemController {
  constructor(private readonly supplyOrderItemService: SupplyOrderItemService) {}

  @Post()
  create(@Body() createSupplyOrderItemDto: Partial<SupplyOrderItem>): Promise<SupplyOrderItem> {
    return this.supplyOrderItemService.create(createSupplyOrderItemDto);
  }

  @Get()
  findAll(): Promise<SupplyOrderItem[]> {
    return this.supplyOrderItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SupplyOrderItem> {
    return this.supplyOrderItemService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplyOrderItemDto: Partial<SupplyOrderItem>,
  ): Promise<SupplyOrderItem> {
    return this.supplyOrderItemService.update(id, updateSupplyOrderItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.supplyOrderItemService.remove(id);
  }
}
