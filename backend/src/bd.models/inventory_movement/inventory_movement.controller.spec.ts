import { Test, TestingModule } from '@nestjs/testing';
import { InventoryMovementController } from './inventory_movement.controller';
import { InventoryMovementService } from './inventory_movement.service';

describe('InventoryMovementController', () => {
  let controller: InventoryMovementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryMovementController],
      providers: [InventoryMovementService],
    }).compile();

    controller = module.get<InventoryMovementController>(InventoryMovementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
