import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { Discount } from '../entity/discount.entity';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  create(@Body() data: Partial<Discount>): Promise<Discount> {
    return this.discountService.create(data);
  }

  @Get()
  findAll(): Promise<Discount[]> {
    return this.discountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Discount> {
    return this.discountService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDiscountDto: Partial<Discount>): Promise<Discount> {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.discountService.remove(id);
  }
}
