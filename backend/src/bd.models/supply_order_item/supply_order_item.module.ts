import { Module } from '@nestjs/common';
import { SupplyOrderItemService } from './supply_order_item.service';
import { SupplyOrderItemController } from './supply_order_item.controller';
import { SupplyOrderItem } from '../entity/supply_order_item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SupplyOrderItem])],
  controllers: [SupplyOrderItemController],
  providers: [SupplyOrderItemService],
  exports: [SupplyOrderItemService],
})
export class SupplyOrderItemModule {}
