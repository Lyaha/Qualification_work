import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: Partial<Task>): Promise<Task> {
    const newTask = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(newTask);
  }

  findAll(): Promise<Task[]> {
    return this.taskRepository.find();
  }

  async findOne(id: string): Promise<Task> {
    const Task = await this.taskRepository.findOne({ where: { id } });
    if (!Task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return Task;
  }

  async update(id: string, updateTaskDto: Partial<Task>): Promise<Task> {
    const Task = await this.findOne(id);
    const updatedTask = this.taskRepository.merge(Task, updateTaskDto);
    return this.taskRepository.save(updatedTask);
  }

  async remove(id: string): Promise<void> {
    const Task = await this.findOne(id);
    await this.taskRepository.remove(Task);
  }
}
