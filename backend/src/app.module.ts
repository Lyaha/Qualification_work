import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import {
  User,
  Category,
  Product,
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
  Task,
  PriceHistory,
  StorageZone,
} from './entity';
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
import { TaskModule } from './task/task.module';
import { MenuModule } from './menu/menu.module';

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
        Task,
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
    TaskModule,
    MenuModule, // Добавляем MenuModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
