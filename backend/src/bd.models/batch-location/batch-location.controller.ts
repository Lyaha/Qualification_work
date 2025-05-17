import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BatchLocationService } from './batch-location.service';
import { BatchLocation } from '../entity/batch-location.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('batch-locations')
export class BatchLocationController {
  constructor(private readonly batchLocationService: BatchLocationService) {}

  @Post()
  create(@Body() createBatchLocationDto: Partial<BatchLocation>): Promise<BatchLocation> {
    return this.batchLocationService.create(createBatchLocationDto);
  }

  @Get('batch/:batchId')
  findByBatchId(@Param('batchId') batchId: string): Promise<BatchLocation[]> {
    return this.batchLocationService.findByBatchId(batchId);
  }

  @Get()
  findAll(): Promise<BatchLocation[]> {
    return this.batchLocationService.findAll();
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateBatchLocationDto: Partial<BatchLocation>,
  ): Promise<BatchLocation> {
    return this.batchLocationService.update(id, updateBatchLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.batchLocationService.remove(id);
  }
}
