import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BatchService } from './batch.service';
import { Batch } from '../entity/batch.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBatchDto } from '../dto/batch.dto';

@ApiTags('Batches')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('batch')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  @Post()
  @ApiOperation({ summary: 'Create new batch' })
  @ApiResponse({ status: 201, type: Batch })
  create(@Body() createBatchDto: CreateBatchDto): Promise<Batch> {
    return this.batchService.create(createBatchDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all batches' })
  @ApiResponse({ status: 200, type: [Batch] })
  findAll(): Promise<Batch[]> {
    return this.batchService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get batch by ID' })
  @ApiResponse({ status: 200, type: Batch })
  @ApiResponse({ status: 404, description: 'Batch not found' })
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
