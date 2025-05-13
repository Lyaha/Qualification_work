import { Test, TestingModule } from '@nestjs/testing';
import { StorageZoneController } from './storage_zone.controller';
import { StorageZoneService } from './storage_zone.service';

describe('StorageZoneController', () => {
  let controller: StorageZoneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageZoneController],
      providers: [StorageZoneService],
    }).compile();

    controller = module.get<StorageZoneController>(StorageZoneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
