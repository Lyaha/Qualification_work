import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SupplierService } from './supplier.service';
import { Supplier } from '../entity/supplier.entity';

@Controller('supplier')
export class SupplierController {
  constructor(private readonly supplierService: SupplierService) {}

  @Post()
  create(@Body() createSupplierDto: Partial<Supplier>): Promise<Supplier> {
    return this.supplierService.create(createSupplierDto);
  }

  @Get()
  findAll(): Promise<Supplier[]> {
    return this.supplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Supplier> {
    return this.supplierService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSupplierDto: Partial<Supplier>): Promise<Supplier> {
    return this.supplierService.update(id, updateSupplierDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.supplierService.remove(id);
  }
}
