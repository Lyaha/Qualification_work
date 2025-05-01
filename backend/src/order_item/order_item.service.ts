import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderItem } from '../entity/order_item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderItemService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
  ) {}

  create(createOrderItemDto: Partial<OrderItem>): Promise<OrderItem> {
    const newOrderItem = this.orderItemRepository.create(createOrderItemDto);
    return this.orderItemRepository.save(newOrderItem);
  }

  findAll(): Promise<OrderItem[]> {
    return this.orderItemRepository.find();
  }

  async findOne(id: string): Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({ where: { id } });
    if (!orderItem) {
      throw new NotFoundException(`OrderItem with ID ${id} not found`);
    }
    return orderItem;
  }

  async update(id: string, updateOrderItemDto: Partial<OrderItem>): Promise<OrderItem> {
    const orderItem = await this.findOne(id);
    const updatedOrderItem = this.orderItemRepository.merge(orderItem, updateOrderItemDto);
    return this.orderItemRepository.save(updatedOrderItem);
  }

  async remove(id: string): Promise<void> {
    const orderItem = await this.findOne(id);
    await this.orderItemRepository.remove(orderItem);
  }
}
