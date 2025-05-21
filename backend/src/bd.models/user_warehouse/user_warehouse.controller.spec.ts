import { Test, TestingModule } from '@nestjs/testing';
import { UserWarehouseController } from './user_warehouse.controller';

describe('UserWarehousesController', () => {
  let controller: UserWarehouseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserWarehouseController],
    }).compile();

    controller = module.get<UserWarehouseController>(UserWarehouseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
