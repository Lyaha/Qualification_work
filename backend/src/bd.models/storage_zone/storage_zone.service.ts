import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StorageZone } from '../entity/storage_zone.entity';
import { Repository } from 'typeorm';

@Injectable()
export class StorageZoneService {
  constructor(
    @InjectRepository(StorageZone)
    private readonly storageZonesRepository: Repository<StorageZone>,
  ) {}

  async create(createStorageZoneDto: Partial<StorageZone>): Promise<StorageZone> {
    const newStorageZone = this.storageZonesRepository.create(createStorageZoneDto);
    return this.storageZonesRepository.save(newStorageZone);
  }

  findAll(): Promise<StorageZone[]> {
    return this.storageZonesRepository.find({ relations: ['warehouse'] });
  }

  async findOne(id: string): Promise<StorageZone> {
    const storageZone = await this.storageZonesRepository.findOne({ where: { id } });
    if (!storageZone) {
      throw new NotFoundException(`StorageZone with ID ${id} not found`);
    }
    return storageZone;
  }

  async update(id: string, updateStorageZoneDto: Partial<StorageZone>): Promise<StorageZone> {
    const storageZone = await this.findOne(id);
    const updatedStorageZone = this.storageZonesRepository.merge(storageZone, updateStorageZoneDto);
    return this.storageZonesRepository.save(updatedStorageZone);
  }

  async remove(id: string): Promise<void> {
    const storageZone = await this.findOne(id);
    await this.storageZonesRepository.remove(storageZone);
  }

  async findByWarehouseId(warehouseId: string): Promise<StorageZone[]> {
    return this.storageZonesRepository.find({
      where: { warehouse: { id: warehouseId } },
      relations: ['warehouse'],
    });
  }
}
