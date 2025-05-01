import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LogService } from './log.service';
import { Log } from '../entity/log.entity';

@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  create(@Body() createLogDto: Partial<Log>): Promise<Log> {
    return this.logService.create(createLogDto);
  }

  @Get()
  findAll(): Promise<Log[]> {
    return this.logService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Log> {
    return this.logService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLogDto: Partial<Log>): Promise<Log> {
    return this.logService.update(id, updateLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.logService.remove(id);
  }
}
