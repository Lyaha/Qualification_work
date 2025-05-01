import { Module } from '@nestjs/common';
import { StorageZoneService } from './storage_zone.service';
import { StorageZoneController } from './storage_zone.controller';
import { StorageZone } from '../entity/storage_zone.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([StorageZone])],
  controllers: [StorageZoneController],
  providers: [StorageZoneService],
  exports: [StorageZoneService],
})
export class StorageZoneModule {}
