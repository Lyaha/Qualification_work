import { Module } from '@nestjs/common';
import { BoxService } from './box.service';
import { BoxController } from './box.controller';
import { Box } from '../entity/box.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Box])],
  controllers: [BoxController],
  providers: [BoxService],
  exports: [BoxService],
})
export class BoxModule {}
