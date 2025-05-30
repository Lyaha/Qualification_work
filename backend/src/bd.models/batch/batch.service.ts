import { Injectable, NotFoundException } from '@nestjs/common';
import { Batch } from '../entity/batch.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BatchService {
  constructor(
    @InjectRepository(Batch)
    private readonly batchsRepository: Repository<Batch>,
  ) {}

  async create(createBatchDto: Partial<Batch>): Promise<Batch> {
    const newBatch = this.batchsRepository.create(createBatchDto);
    return this.batchsRepository.save(newBatch);
  }

  findAll(): Promise<Batch[]> {
    return this.batchsRepository.find({
      order: { expiration_date: 'ASC' },
      relations: ['product'],
    });
  }

  async findOne(id: string): Promise<Batch> {
    const batch = await this.batchsRepository.findOne({ where: { id } });
    if (!batch) {
      throw new NotFoundException(`Batch with ID ${id} not found`);
    }
    return batch;
  }

  async findByProductId(productId: string): Promise<Batch[]> {
    const batches = await this.batchsRepository.find({
      where: { product: { id: productId } },
      relations: ['product'],
    });

    if (!batches.length) {
      throw new NotFoundException(`Batches for product ID ${productId} not found`);
    }

    return batches;
  }

  async update(id: string, updateBatchDto: Partial<Batch>): Promise<Batch> {
    const batch = await this.findOne(id);
    const updatedBatch = this.batchsRepository.merge(batch, updateBatchDto);
    return this.batchsRepository.save(updatedBatch);
  }

  async remove(id: string): Promise<void> {
    const batch = await this.findOne(id);
    await this.batchsRepository.remove(batch);
  }
}
