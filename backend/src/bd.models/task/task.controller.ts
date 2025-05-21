import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { Batch, CompleteTaskDto, Task, User } from '../entity';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CurrentUser } from '../../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/my')
  findMyTasks(@CurrentUser() currentUser: User): Promise<Task[]> {
    const task = this.taskService.findByField('worker_id', currentUser.id);
    return task;
  }

  @Put('/complete/:id')
  async completeTask(
    @Param('id') id: string,
    @Body() completeTaskDto: CompleteTaskDto,
    @CurrentUser() user: User,
  ): Promise<Task> {
    return this.taskService.completeTask(id, completeTaskDto, user);
  }

  @Get(':id/batches')
  async getBatchesForTask(@Param('id') id: string, @CurrentUser() user: User): Promise<Batch[]> {
    return this.taskService.getBatchesForTask(id, user);
  }

  @Post()
  create(@Body() createTaskDto: Partial<Task>): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: Partial<Task>): Promise<Task> {
    return this.taskService.update(id, updateTaskDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.taskService.remove(id);
  }
}
