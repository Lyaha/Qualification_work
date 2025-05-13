import { Test, TestingModule } from '@nestjs/testing';
import { SupplyOrderService } from './supply_order.service';

describe('SupplyOrderService', () => {
  let service: SupplyOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupplyOrderService],
    }).compile();

    service = module.get<SupplyOrderService>(SupplyOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
