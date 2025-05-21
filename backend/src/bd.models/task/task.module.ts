import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskController } from './task.controller';
import {
  Batch,
  InventoryMovement,
  OrderItem,
  SupplyOrderItem,
  Task,
  UserWarehouse,
} from '../entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task]),
    TypeOrmModule.forFeature([Batch]),
    TypeOrmModule.forFeature([InventoryMovement]),
    TypeOrmModule.forFeature([OrderItem]),
    TypeOrmModule.forFeature([SupplyOrderItem]),
    TypeOrmModule.forFeature([UserWarehouse]),
  ],
  controllers: [TaskController],
  providers: [TaskService],
  exports: [TaskService],
})
export class TaskModule {}
