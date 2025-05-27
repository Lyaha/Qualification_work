import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { SupplyOrderItemService } from './supply_order_item.service';
import { SupplyOrderItem } from '../entity/supply_order_item.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateSupplyOrderItemDto } from '../dto/supply-order-item.dto';

@ApiTags('Supply Order Items')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('supply-order-item')
export class SupplyOrderItemController {
  constructor(private readonly supplyOrderItemService: SupplyOrderItemService) {}

  @Post()
  @ApiOperation({ summary: 'Create new supply order item' })
  @ApiResponse({ status: 201, description: 'Supply order item created successfully' })
  create(@Body() createDto: CreateSupplyOrderItemDto): Promise<SupplyOrderItem> {
    return this.supplyOrderItemService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all supply order items' })
  @ApiResponse({ status: 200, description: 'List of supply order items' })
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
