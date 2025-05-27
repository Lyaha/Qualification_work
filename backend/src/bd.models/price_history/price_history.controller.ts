import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { PriceHistoryService } from './price_history.service';
import { PriceHistory } from '../entity/price_history.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePriceHistoryDto } from '../dto/price-history.dto';

@ApiTags('Price History')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('price-history')
export class PriceHistoryController {
  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create price history record' })
  @ApiResponse({ status: 201, type: PriceHistory })
  create(@Body() createDto: CreatePriceHistoryDto): Promise<PriceHistory> {
    return this.priceHistoryService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all price history records' })
  @ApiResponse({ status: 200, type: [PriceHistory] })
  findAll(): Promise<PriceHistory[]> {
    return this.priceHistoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<PriceHistory> {
    return this.priceHistoryService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePriceHistoryDto: Partial<PriceHistory>,
  ): Promise<PriceHistory> {
    return this.priceHistoryService.update(id, updatePriceHistoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.priceHistoryService.remove(id);
  }
}
