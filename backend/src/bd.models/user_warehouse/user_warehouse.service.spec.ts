import { Test, TestingModule } from '@nestjs/testing';
import { UserWarehousesService } from './user_warehouse.service';

describe('UserWarehousesService', () => {
  let service: UserWarehousesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserWarehousesService],
    }).compile();

    service = module.get<UserWarehousesService>(UserWarehousesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
