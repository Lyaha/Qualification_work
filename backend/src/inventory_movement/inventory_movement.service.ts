import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InventoryMovement } from '../entity/inventory_movement.entity';

@Injectable()
export class InventoryMovementService {
  constructor(
    @InjectRepository(InventoryMovement)
    private readonly inven_movRepository: Repository<InventoryMovement>,
  ) {}

  create(createInventoryMovementDto: Partial<InventoryMovement>): Promise<InventoryMovement> {
    const inventoryMovement = this.inven_movRepository.create(createInventoryMovementDto);
    return this.inven_movRepository.save(inventoryMovement);
  }

  findAll(): Promise<InventoryMovement[]> {
    return this.inven_movRepository.find();
  }

  async findOne(id: string): Promise<InventoryMovement> {
    const inventory_movement = await this.inven_movRepository.findOne({ where: { id } });
    if (!inventory_movement) {
      throw new NotFoundException(`InventoryMovement with ID ${id} not found`);
    }
    return inventory_movement;
  }

  async update(
    id: string,
    updateInventoryMovementDto: Partial<InventoryMovement>,
  ): Promise<InventoryMovement> {
    const inventoryMovement = await this.findOne(id);
    const updatedInventoryMovement = this.inven_movRepository.merge(
      inventoryMovement,
      updateInventoryMovementDto,
    );
    return this.inven_movRepository.save(updatedInventoryMovement);
  }

  async remove(id: string): Promise<void> {
    const inventoryMovement = await this.findOne(id);
    await this.inven_movRepository.remove(inventoryMovement);
  }
}
