import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BatchLocation } from '../entity/batch-location.entity';
import { BatchLocationService } from './batch-location.service';
import { BatchLocationController } from './batch-location.controller';

@Module({
  imports: [TypeOrmModule.forFeature([BatchLocation])],
  controllers: [BatchLocationController],
  providers: [BatchLocationService],
  exports: [BatchLocationService],
})
export class BatchLocationModule {}
