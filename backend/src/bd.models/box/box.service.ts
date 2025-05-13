import { Injectable, NotFoundException } from '@nestjs/common';
import { Box } from '../entity/box.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BoxService {
  constructor(
    @InjectRepository(Box)
    private readonly boxesRepository: Repository<Box>,
  ) {}

  async create(createBoxDto: Partial<Box>): Promise<Box> {
    const newBox = this.boxesRepository.create(createBoxDto);
    return this.boxesRepository.save(newBox);
  }

  findAll(): Promise<Box[]> {
    return this.boxesRepository.find();
  }

  async findOne(id: string): Promise<Box> {
    const box = await this.boxesRepository.findOne({ where: { id } });
    if (!box) {
      throw new NotFoundException(`Box with ID ${id} not found`);
    }
    return box;
  }

  async update(id: string, updateBoxDto: Partial<Box>): Promise<Box> {
    const box = await this.findOne(id);
    const updatedBox = this.boxesRepository.merge(box, updateBoxDto);
    return this.boxesRepository.save(updatedBox);
  }

  async remove(id: string): Promise<void> {
    const box = await this.findOne(id);
    await this.boxesRepository.remove(box);
  }
}
