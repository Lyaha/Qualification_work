import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWarehouse } from '../entity';
import { UserWarehouseController } from './user_warehouse.controller';
import { UserWarehousesService } from './user_warehouse.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserWarehouse])],
  controllers: [UserWarehouseController],
  providers: [UserWarehousesService],
  exports: [UserWarehousesService],
})
export class UserWarehousesModule {}
