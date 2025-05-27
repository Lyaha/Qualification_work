import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BatchLocationService } from './batch-location.service';
import { BatchLocation } from '../entity/batch-location.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBatchLocationDto } from '../dto/batch-location.dto';

@ApiTags('Batch Locations')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('batch-locations')
export class BatchLocationController {
  constructor(private readonly batchLocationService: BatchLocationService) {}

  @Post()
  @ApiOperation({ summary: 'Create new batch location' })
  @ApiResponse({ status: 201, type: BatchLocation })
  create(@Body() createDto: CreateBatchLocationDto): Promise<BatchLocation> {
    return this.batchLocationService.create(createDto);
  }

  @Get('batch/:batchId')
  @ApiOperation({ summary: 'Get locations by batch ID' })
  @ApiResponse({ status: 200, type: [BatchLocation] })
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
