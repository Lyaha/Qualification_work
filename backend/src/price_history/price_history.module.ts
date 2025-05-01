import { Module } from '@nestjs/common';
import { PriceHistoryService } from './price_history.service';
import { PriceHistoryController } from './price_history.controller';
import { PriceHistory } from '../entity/price_history.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([PriceHistory])],
  controllers: [PriceHistoryController],
  providers: [PriceHistoryService],
  exports: [PriceHistoryService],
})
export class PriceHistoryModule {}
