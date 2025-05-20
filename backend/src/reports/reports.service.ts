import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Batch, Order, OrderItem, Product, Task } from '../bd.models/entity';
import { groupByDate, sumTotal, groupByStatus, Sale } from './utils/groupers';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Batch)
    private readonly batchRepository: Repository<Batch>,
  ) {}

  async getSalesReport(start: string, end: string, warehouse: string) {
    try {
      const query = this.orderItemRepository
        .createQueryBuilder('item')
        .leftJoinAndSelect('item.order', 'o')
        .where('o.created_at BETWEEN :start AND :end', {
          start: new Date(start),
          end: new Date(end),
        })
        .andWhere('o.status != :canceled', { canceled: 'canceled' });

      if (warehouse !== 'undefined') {
        query.andWhere('o.warehouse_id = :warehouse', { warehouse });
      }

      const orderItems = await query.getMany();

      const salesData = orderItems.reduce(
        (acc: any, item: any) => {
          const orderDate = new Date(item.order.created_at).toISOString().split('T')[0];
          acc.totalSales += item.unit_price * item.quantity;
          acc.ordersCount.add(item.order.id);

          if (!acc.dailySales[orderDate]) {
            acc.dailySales[orderDate] = 0;
          }
          acc.dailySales[orderDate] += item.unit_price * item.quantity;

          return acc;
        },
        {
          totalSales: 0,
          ordersCount: new Set<string>(),
          dailySales: {} as Record<string, number>,
        },
      );

      return {
        dailySales: Object.entries(salesData.dailySales).map(([date, total]) => ({ date, total })),
        totalSales: salesData.totalSales,
        avgOrder:
          salesData.ordersCount.size > 0 ? salesData.totalSales / salesData.ordersCount.size : 0,
        ordersCount: salesData.ordersCount.size,
      };
    } catch (error) {
      throw new Error(`Failed to generate sales report: ${error}`);
    }
  }

  async getInventoryReport() {
    try {
      const batchTotals = await this.batchRepository
        .createQueryBuilder('batch')
        .select('batch.product_id', 'productId')
        .addSelect('SUM(batch.quantity)', 'total')
        .groupBy('batch.product_id')
        .getRawMany();

      const totalsMap = new Map(
        batchTotals.map((item) => [item.productId, parseInt(item.total) || 0]),
      );

      const products = await this.productRepository.find();

      return products.map((product) => ({
        category: product.category,
        quantity: totalsMap.get(product.id) || 0,
      }));
    } catch (error) {
      throw new Error(`Failed to generate inventory report: ${error}`);
    }
  }

  async getTasksReport() {
    try {
      const tasks = await this.taskRepository.find();
      const statusCounts = groupByStatus(tasks);
      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count,
      }));
    } catch (error) {
      throw new Error(`Failed to generate tasks report: ${error}`);
    }
  }
}
