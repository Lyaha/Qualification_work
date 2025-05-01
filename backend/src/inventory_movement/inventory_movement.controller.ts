import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InventoryMovementService } from './inventory_movement.service';
import { InventoryMovement } from '../entity/inventory_movement.entity';

@Controller('inventory-movement')
export class InventoryMovementController {
  constructor(private readonly inventoryMovementService: InventoryMovementService) {}

  @Post()
  create(
    @Body() createInventoryMovementDto: Partial<InventoryMovement>,
  ): Promise<InventoryMovement> {
    return this.inventoryMovementService.create(createInventoryMovementDto);
  }

  @Get()
  findAll(): Promise<InventoryMovement[]> {
    return this.inventoryMovementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<InventoryMovement> {
    return this.inventoryMovementService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryMovementDto: Partial<InventoryMovement>,
  ): Promise<InventoryMovement> {
    return this.inventoryMovementService.update(id, updateInventoryMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.inventoryMovementService.remove(id);
  }
}
