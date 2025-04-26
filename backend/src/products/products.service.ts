import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    const user = await this.productsRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async create(data: Partial<Product>): Promise<Product> {
    const newUser = this.productsRepository.create(data);
    return this.productsRepository.save(newUser);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const user = await this.findOne(id);
    const updatedUser = this.productsRepository.merge(user, data);
    return this.productsRepository.save(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.productsRepository.remove(user);
  }
}
