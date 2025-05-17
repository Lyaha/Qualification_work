import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Batch } from '../entity/batch.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  create(@Body() createBatchDto: Partial<Batch>): Promise<Batch> {
    return this.batchService.create(createBatchDto);
  }

  @Get()
  findAll(): Promise<Batch[]> {
    return this.batchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Batch> {
    return this.batchService.findOne(id);
  }

  @Get('product/:productId')
  @UseGuards(JwtAuthGuard)
  findByProductId(@Param('productId') productId: string): Promise<Batch[]> {
    return this.batchService.findByProductId(productId);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBatchDto: Partial<Batch>): Promise<Batch> {
    return this.batchService.update(id, updateBatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.batchService.remove(id);
  }
}
