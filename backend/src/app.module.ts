import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { User } from './entity/user.entity';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { Category } from './entity/category.entity';
import { Product } from './entity/product.entity';
import { Warehouse } from './entity/warehouse.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'warehouse_db',
      entities: [User, Product, Category, Warehouse],
      synchronize: false, // true тільки в dev-режимі
      autoLoadEntities: true,
    }),
    UsersModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
