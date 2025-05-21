import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import { Batch, Category, Order, OrderItem, Product, Task } from 'src/bd.models';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Task]),
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([Batch]),
    TypeOrmModule.forFeature([OrderItem]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
