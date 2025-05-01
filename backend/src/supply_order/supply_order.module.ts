import { Module } from '@nestjs/common';
import { SupplyOrderService } from './supply_order.service';
import { SupplyOrderController } from './supply_order.controller';
import { SupplyOrder } from '../entity/supply_order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SupplyOrder])],
  controllers: [SupplyOrderController],
  providers: [SupplyOrderService],
  exports: [SupplyOrderService],
})
export class SupplyOrderModule {}
