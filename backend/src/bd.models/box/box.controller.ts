import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BoxService } from './box.service';
import { Box } from '../entity/box.entity';

@Controller('box')
export class BoxController {
  constructor(private readonly boxService: BoxService) {}

  @Post()
  create(@Body() createBoxDto: Partial<Box>): Promise<Box> {
    return this.boxService.create(createBoxDto);
  }

  @Get()
  findAll(): Promise<Box[]> {
    return this.boxService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Box> {
    return this.boxService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBoxDto: Partial<Box>): Promise<Box> {
    return this.boxService.update(id, updateBoxDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.boxService.remove(id);
  }
}
