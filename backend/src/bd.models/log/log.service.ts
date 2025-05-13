import { Injectable } from '@nestjs/common';
import { Log } from '../entity/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LogService {
  constructor(
    @InjectRepository(Log)
    private readonly logsRepository: Repository<Log>,
  ) {}

  async create(createLogDto: Partial<Log>): Promise<Log> {
    const newLog = this.logsRepository.create(createLogDto);
    return this.logsRepository.save(newLog);
  }

  findAll(): Promise<Log[]> {
    return this.logsRepository.find();
  }

  async findOne(id: string): Promise<Log> {
    const log = await this.logsRepository.findOne({ where: { id } });
    if (!log) {
      throw new Error(`Log with ID ${id} not found`);
    }
    return log;
  }

  async update(id: string, updateLogDto: Partial<Log>): Promise<Log> {
    const log = await this.findOne(id.toString());
    const updatedLog = this.logsRepository.merge(log, updateLogDto);
    return this.logsRepository.save(updatedLog);
  }

  async remove(id: string): Promise<void> {
    const log = await this.findOne(id);
    await this.logsRepository.remove(log);
  }
}
