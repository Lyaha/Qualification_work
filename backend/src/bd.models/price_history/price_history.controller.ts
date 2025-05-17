import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { PriceHistoryService } from './price_history.service';
import { PriceHistory } from '../entity/price_history.entity';

@Controller('price-history')
export class PriceHistoryController {
  constructor(private readonly priceHistoryService: PriceHistoryService) {}

  @Post()
  create(@Body() createPriceHistoryDto: Partial<PriceHistory>): Promise<PriceHistory> {
    return this.priceHistoryService.create(createPriceHistoryDto);
  }

  @Get()
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
