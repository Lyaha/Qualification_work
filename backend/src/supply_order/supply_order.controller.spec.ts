import { Test, TestingModule } from '@nestjs/testing';
import { SupplyOrderController } from './supply_order.controller';
import { SupplyOrderService } from './supply_order.service';

describe('SupplyOrderController', () => {
  let controller: SupplyOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplyOrderController],
      providers: [SupplyOrderService],
    }).compile();

    controller = module.get<SupplyOrderController>(SupplyOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
