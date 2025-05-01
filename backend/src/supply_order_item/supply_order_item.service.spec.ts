import { Test, TestingModule } from '@nestjs/testing';
import { SupplyOrderItemService } from './supply_order_item.service';

describe('SupplyOrderItemService', () => {
  let service: SupplyOrderItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyOrderItemService],
    }).compile();

    service = module.get<SupplyOrderItemService>(SupplyOrderItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
