import { Module } from '@nestjs/common';
import { InventoryMovementService } from './inventory_movement.service';
import { InventoryMovementController } from './inventory_movement.controller';
import { InventoryMovement } from '../entity/inventory_movement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([InventoryMovement])],
  controllers: [InventoryMovementController],
  providers: [InventoryMovementService],
  exports: [InventoryMovementService],
})
export class InventoryMovementModule {}
