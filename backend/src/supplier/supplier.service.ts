import { Injectable, NotFoundException } from '@nestjs/common';
import { Supplier } from '../entity/supplier.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SupplierService {
  constructor(
    @InjectRepository(Supplier)
    private readonly suppliersRepository: Repository<Supplier>,
  ) {}

  async create(createSupplierDto: Partial<Supplier>): Promise<Supplier> {
    const newSupplier = this.suppliersRepository.create(createSupplierDto);
    return this.suppliersRepository.save(newSupplier);
  }

  findAll(): Promise<Supplier[]> {
    return this.suppliersRepository.find();
  }

  async findOne(id: string): Promise<Supplier> {
    const supplier = await this.suppliersRepository.findOne({ where: { id } });
    if (!supplier) {
      throw new NotFoundException(`Supplier with ID ${id} not found`);
    }
    return supplier;
  }

  async update(id: string, updateSupplierDto: Partial<Supplier>): Promise<Supplier> {
    const supplier = await this.findOne(id);
    const updatedSupplier = this.suppliersRepository.merge(supplier, updateSupplierDto);
    return this.suppliersRepository.save(updatedSupplier);
  }

  async remove(id: string): Promise<void> {
    const supplier = await this.findOne(id);
    await this.suppliersRepository.remove(supplier);
  }
}
