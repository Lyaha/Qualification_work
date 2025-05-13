import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Category } from '../entity/category.entity';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() data: Partial<Category>): Promise<Category> {
    return this.categoryService.create(data);
  }

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Category> {
    return this.categoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: Partial<Category>): Promise<Category> {
    return this.categoryService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.categoryService.remove(id);
  }
}
