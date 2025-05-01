import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplyOrder } from '../entity/supply_order.entity';

@Injectable()
export class SupplyOrderService {
  constructor(
    @InjectRepository(SupplyOrder)
    private readonly supplyOrderRepository: Repository<SupplyOrder>,
  ) {}

  create(createSupplyOrderDto: Partial<SupplyOrder>): Promise<SupplyOrder> {
    const newSupplyOrder = this.supplyOrderRepository.create(createSupplyOrderDto);
    return this.supplyOrderRepository.save(newSupplyOrder);
  }

  findAll(): Promise<SupplyOrder[]> {
    return this.supplyOrderRepository.find();
  }

  async findOne(id: string): Promise<SupplyOrder> {
    const supplyOrder = await this.supplyOrderRepository.findOne({ where: { id } });
    if (!supplyOrder) {
      throw new NotFoundException(`SupplyOrder with ID ${id} not found`);
    }
    return supplyOrder;
  }

  async update(id: string, updateSupplyOrderDto: Partial<SupplyOrder>): Promise<SupplyOrder> {
    const supplyOrder = await this.findOne(id);
    const updatedSupplyOrder = this.supplyOrderRepository.merge(supplyOrder, updateSupplyOrderDto);
    return this.supplyOrderRepository.save(updatedSupplyOrder);
  }

  async remove(id: string): Promise<void> {
    const supplyOrder = await this.findOne(id);
    await this.supplyOrderRepository.remove(supplyOrder);
  }
}
