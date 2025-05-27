import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { Log } from '../entity/log.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateLogDto } from '../dto/log.dto';

@ApiTags('Logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('log')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Post()
  @ApiOperation({ summary: 'Create new log entry' })
  @ApiResponse({ status: 201, type: Log })
  create(@Body() createLogDto: CreateLogDto): Promise<Log> {
    return this.logService.create(createLogDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all logs' })
  @ApiResponse({ status: 200, type: [Log] })
  findAll(): Promise<Log[]> {
    return this.logService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get log by ID' })
  @ApiResponse({ status: 200, type: Log })
  @ApiResponse({ status: 404, description: 'Log not found' })
  findOne(@Param('id') id: string): Promise<Log> {
    return this.logService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateLogDto: Partial<Log>): Promise<Log> {
    return this.logService.update(id, updateLogDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.logService.remove(id);
  }
}
