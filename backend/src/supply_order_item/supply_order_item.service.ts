import { Injectable, NotFoundException } from '@nestjs/common';
import { SupplyOrderItem } from '../entity/supply_order_item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SupplyOrderItemService {
  constructor(
    @InjectRepository(SupplyOrderItem)
    private readonly supplyOrderItemRepository: Repository<SupplyOrderItem>,
  ) {}

  async create(createSupplyOrderItemDto: Partial<SupplyOrderItem>): Promise<SupplyOrderItem> {
    const newSupplyOrderItem = this.supplyOrderItemRepository.create(createSupplyOrderItemDto);
    return this.supplyOrderItemRepository.save(newSupplyOrderItem);
  }

  findAll(): Promise<SupplyOrderItem[]> {
    return this.supplyOrderItemRepository.find();
  }

  async findOne(id: string): Promise<SupplyOrderItem> {
    const supplyOrderItem = await this.supplyOrderItemRepository.findOne({ where: { id } });
    if (!supplyOrderItem) {
      throw new NotFoundException(`SupplyOrderItem with ID ${id} not found`);
    }
    return supplyOrderItem;
  }

  async update(
    id: string,
    updateSupplyOrderItemDto: Partial<SupplyOrderItem>,
  ): Promise<SupplyOrderItem> {
    const supplyOrderItem = await this.findOne(id);
    const updatedSupplyOrderItem = this.supplyOrderItemRepository.merge(
      supplyOrderItem,
      updateSupplyOrderItemDto,
    );
    return this.supplyOrderItemRepository.save(updatedSupplyOrderItem);
  }

  async remove(id: string): Promise<void> {
    const supplyOrderItem = await this.findOne(id);
    await this.supplyOrderItemRepository.remove(supplyOrderItem);
  }
}
