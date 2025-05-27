import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { Discount } from '../entity/discount.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateDiscountDto } from '../dto/discount.dto';

@ApiTags('Discounts')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Post()
  @ApiOperation({ summary: 'Create new discount' })
  @ApiResponse({ status: 201, type: Discount })
  create(@Body() createDiscountDto: CreateDiscountDto): Promise<Discount> {
    return this.discountService.create(createDiscountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all discounts' })
  @ApiResponse({ status: 200, type: [Discount] })
  findAll(): Promise<Discount[]> {
    return this.discountService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get discount by ID' })
  @ApiResponse({ status: 200, type: Discount })
  findOne(@Param('id') id: string): Promise<Discount> {
    return this.discountService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update discount by ID' })
  @ApiResponse({ status: 200, type: Discount })
  update(@Param('id') id: string, @Body() updateDiscountDto: Partial<Discount>): Promise<Discount> {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete discount by ID' })
  @ApiResponse({ status: 204 })
  remove(@Param('id') id: string): Promise<void> {
    return this.discountService.remove(id);
  }
}
