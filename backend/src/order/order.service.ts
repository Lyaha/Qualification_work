import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: Partial<Order>): Promise<Order> {
    const newOrder = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(newOrder);
  }

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: Partial<Order>): Promise<Order> {
    const order = await this.findOne(id);
    const updatedOrder = this.orderRepository.merge(order, updateOrderDto);
    return this.orderRepository.save(updatedOrder);
  }

  async remove(id: string): Promise<void> {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);
  }
}
