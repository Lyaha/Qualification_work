import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { OrderItemService } from './order_item.service';
import { OrderItem } from '../entity/order_item.entity';

@Controller('order-item')
export class OrderItemController {
  constructor(private readonly orderItemService: OrderItemService) {}

  @Post()
  create(@Body() createOrderItemDto: Partial<OrderItem>): Promise<OrderItem> {
    return this.orderItemService.create(createOrderItemDto);
  }

  @Get()
  findAll(): Promise<OrderItem[]> {
    return this.orderItemService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<OrderItem> {
    return this.orderItemService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: Partial<OrderItem>,
  ): Promise<OrderItem> {
    return this.orderItemService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.orderItemService.remove(id);
  }
}
