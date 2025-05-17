import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SupplyOrderService } from './supply_order.service';
import { SupplyOrder } from '../entity/supply_order.entity';

@Controller('supply-order')
export class SupplyOrderController {
  constructor(private readonly supplyOrderService: SupplyOrderService) {}

  @Post()
  create(@Body() createSupplyOrderDto: Partial<SupplyOrder>): Promise<SupplyOrder> {
    return this.supplyOrderService.create(createSupplyOrderDto);
  }

  @Get()
  findAll(): Promise<SupplyOrder[]> {
    return this.supplyOrderService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<SupplyOrder> {
    return this.supplyOrderService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateSupplyOrderDto: Partial<SupplyOrder>,
  ): Promise<SupplyOrder> {
    return this.supplyOrderService.update(id, updateSupplyOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.supplyOrderService.remove(id);
  }
}
