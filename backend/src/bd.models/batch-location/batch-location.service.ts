import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BatchLocation } from '../entity/batch-location.entity';

@Injectable()
export class BatchLocationService {
  constructor(
    @InjectRepository(BatchLocation)
    private readonly batchLocationRepository: Repository<BatchLocation>,
  ) {}

  async create(createBatchLocationDto: Partial<BatchLocation>): Promise<BatchLocation> {
    const newLocation = this.batchLocationRepository.create(createBatchLocationDto);
    return this.batchLocationRepository.save(newLocation);
  }

  findAll(): Promise<BatchLocation[]> {
    return this.batchLocationRepository.find({ relations: ['storage_zone', 'box'] });
  }

  async findByBatchId(batchId: string): Promise<BatchLocation[]> {
    const locations = await this.batchLocationRepository.find({
      where: { batch_id: batchId },
      relations: ['storage_zone', 'box'],
    });

    if (!locations.length) {
      throw new NotFoundException(`Locations for batch ID ${batchId} not found`);
    }

    return locations;
  }

  async update(id: string, updateDto: Partial<BatchLocation>): Promise<BatchLocation> {
    const location = await this.batchLocationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`BatchLocation with ID ${id} not found`);
    }

    const updatedLocation = this.batchLocationRepository.merge(location, updateDto);
    return this.batchLocationRepository.save(updatedLocation);
  }

  async remove(id: string): Promise<void> {
    const location = await this.batchLocationRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`BatchLocation with ID ${id} not found`);
    }
    await this.batchLocationRepository.remove(location);
  }
}
