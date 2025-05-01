import { Test, TestingModule } from '@nestjs/testing';
import { StorageZoneService } from './storage_zone.service';

describe('StorageZoneService', () => {
  let service: StorageZoneService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageZoneService],
    }).compile();

    service = module.get<StorageZoneService>(StorageZoneService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
