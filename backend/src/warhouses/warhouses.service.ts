import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from '../entity/warehouse.entity';

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehousesRepository: Repository<Warehouse>,
  ) {}

  findAll(): Promise<Warehouse[]> {
    return this.warehousesRepository.find();
  }

  async findOne(id: string): Promise<Warehouse> {
    const user = await this.warehousesRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(data: Partial<Warehouse>): Promise<Warehouse> {
    const newUser = this.warehousesRepository.create(data);
    return this.warehousesRepository.save(newUser);
  }

  async update(id: string, data: Partial<Warehouse>): Promise<Warehouse> {
    const user = await this.findOne(id);
    const updatedUser = this.warehousesRepository.merge(user, data);
    return this.warehousesRepository.save(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.warehousesRepository.remove(user);
  }
}
