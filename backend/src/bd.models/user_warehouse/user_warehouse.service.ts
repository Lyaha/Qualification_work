import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserWarehouse } from '../entity';

@Injectable()
export class UserWarehousesService {
  constructor(
    @InjectRepository(UserWarehouse)
    private readonly userWarehousesRepository: Repository<UserWarehouse>,
  ) {}

  findAll(): Promise<UserWarehouse[]> {
    return this.userWarehousesRepository.find({ relations: ['manager'] });
  }

  async findOne(id: string): Promise<UserWarehouse> {
    const userWarehouse = await this.userWarehousesRepository.findOne({ where: { id } });
    if (!userWarehouse) {
      throw new NotFoundException(`UserWarehouse with ID ${id} not found`);
    }
    return userWarehouse;
  }

  async create(data: Partial<UserWarehouse>): Promise<UserWarehouse> {
    const newUserWarehouse = this.userWarehousesRepository.create(data);
    return this.userWarehousesRepository.save(newUserWarehouse);
  }

  async update(id: string, data: Partial<UserWarehouse>): Promise<UserWarehouse> {
    const userWarehouse = await this.findOne(id);
    const updatedUserWarehouse = this.userWarehousesRepository.merge(userWarehouse, data);
    return this.userWarehousesRepository.save(updatedUserWarehouse);
  }

  async remove(id: string): Promise<void> {
    const userWarehouse = await this.findOne(id);
    await this.userWarehousesRepository.remove(userWarehouse);
  }
}
