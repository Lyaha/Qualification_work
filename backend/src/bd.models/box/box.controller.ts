import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { BoxService } from './box.service';
import { Box } from '../entity/box.entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateBoxDto } from '../dto/box.dto';

@ApiTags('Boxes')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Post()
  @ApiOperation({ summary: 'Create new box' })
  @ApiResponse({ status: 201, type: Box })
  create(@Body() createBoxDto: CreateBoxDto): Promise<Box> {
    return this.boxService.create(createBoxDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all boxes' })
  @ApiResponse({ status: 200, type: [Box] })
  findAll(): Promise<Box[]> {
    return this.boxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Box> {
    return this.boxService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateBoxDto: Partial<Box>): Promise<Box> {
    return this.boxService.update(id, updateBoxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.boxService.remove(id);
  }
}
