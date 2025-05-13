import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchController } from './batch.controller';
import { Batch } from '../entity/batch.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Batch])],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService],
})
export class BatchModule {}
