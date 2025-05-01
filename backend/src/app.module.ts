import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { User } from './entity/user.entity';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { Category } from './entity/category.entity';
import { Product } from './entity/product.entity';
import { Warehouse } from './entity/warehouse.entity';
import { Discount } from './entity/discount.entity';
import { InventoryMovement } from './entity/inventory_movement.entity';
import { OrderItem } from './entity/order_item.entity';
import { Order } from './entity/order.entity';
import { ParkingSpot } from './entity/parking_spot.entity';
import { Review } from './entity/review.entity';
import { SupplyOrder } from './entity/supply_order.entity';
import { SupplyOrderItem } from './entity/supply_order_item.entity';
import { Supplier } from './entity/supplier.entity';
import { Batch } from './entity/batch.entity';
import { Box } from './entity/box.entity';
import { Log } from './entity/log.entity';
import { PriceHistory } from './entity/price_history.entity';
import { StorageZone } from './entity/storage_zone.entity';
import { AuthModule } from './auth/auth.module';
import { WarehousesModule } from './warhouses/warhouses.module';
import { OrderModule } from './order/order.module';
import { CategoryModule } from './category/category.module';
import { DiscountModule } from './discount/discount.module';
import { InventoryMovementModule } from './inventory_movement/inventory_movement.module';
import { OrderItemModule } from './order_item/order_item.module';
import { ParkingSpotModule } from './parking_spot/parking_spot.module';
import { ReviewModule } from './review/review.module';
import { SupplyOrderItemModule } from './supply_order_item/supply_order_item.module';
import { SupplyOrderModule } from './supply_order/supply_order.module';
import { BatchModule } from './batch/batch.module';
import { BoxModule } from './box/box.module';
import { LogModule } from './log/log.module';
import { PriceHistoryModule } from './price_history/price_history.module';
import { StorageZoneModule } from './storage_zone/storage_zone.module';
import { SupplierModule } from './supplier/supplier.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'warehouse_db',
      entities: [
        User,
        Product,
        Category,
        Warehouse,
        Discount,
        InventoryMovement,
        OrderItem,
        Order,
        ParkingSpot,
        Review,
        SupplyOrder,
        SupplyOrderItem,
        Supplier,
        Batch,
        Box,
        Log,
        PriceHistory,
        StorageZone,
      ],
      synchronize: false, // true тільки в dev-режимі
      autoLoadEntities: true,
    }),
    UsersModule,
    ProductsModule,
    WarehousesModule,
    AuthModule,
    OrderModule,
    CategoryModule,
    DiscountModule,
    InventoryMovementModule,
    OrderItemModule,
    ParkingSpotModule,
    ReviewModule,
    SupplyOrderItemModule,
    SupplyOrderModule,
    BatchModule,
    BoxModule,
    LogModule,
    PriceHistoryModule,
    StorageZoneModule,
    SupplierModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
