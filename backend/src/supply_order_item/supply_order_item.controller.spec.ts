import { Test, TestingModule } from '@nestjs/testing';
import { SupplyOrderItemController } from './supply_order_item.controller';
import { SupplyOrderItemService } from './supply_order_item.service';

describe('SupplyOrderItemController', () => {
  let controller: SupplyOrderItemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SupplyOrderItemController],
      providers: [SupplyOrderItemService],
    }).compile();

    controller = module.get<SupplyOrderItemController>(SupplyOrderItemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
