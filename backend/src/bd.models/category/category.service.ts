import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entity/category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categorysRepository: Repository<Category>,
  ) {}

  create(data: Partial<Category>): Promise<Category> {
    const newCategory = this.categorysRepository.create(data);
    return this.categorysRepository.save(newCategory);
  }

  findAll(): Promise<Category[]> {
    return this.categorysRepository.find();
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categorysRepository.findOne({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }
    return category;
  }

  async update(id: string, data: Partial<Category>): Promise<Category> {
    const category = await this.findOne(id);
    const updatedCategory = this.categorysRepository.merge(category, data);
    return this.categorysRepository.save(updatedCategory);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);
    await this.categorysRepository.remove(category);
  }
}
