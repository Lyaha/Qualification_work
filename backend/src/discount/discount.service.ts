import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Discount } from '../entity/discount.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(Discount)
    private readonly discountsRepository: Repository<Discount>,
  ) {}

  create(data: Partial<Discount>): Promise<Discount> {
    const newDiscount = this.discountsRepository.create(data);
    return this.discountsRepository.save(newDiscount);
  }

  findAll(): Promise<Discount[]> {
    return this.discountsRepository.find();
  }

  async findOne(id: string): Promise<Discount> {
    const discount = await this.discountsRepository.findOne({ where: { id } });
    if (!discount) {
      throw new NotFoundException(`Discount with ID ${id} not found`);
    }
    return discount;
  }

  async update(id: string, data: Partial<Discount>): Promise<Discount> {
    const discount = await this.findOne(id);
    const updatedDiscount = this.discountsRepository.merge(discount, data);
    return this.discountsRepository.save(updatedDiscount);
  }

  async remove(id: string): Promise<void> {
    const discount = await this.findOne(id);
    await this.discountsRepository.remove(discount);
  }
}
