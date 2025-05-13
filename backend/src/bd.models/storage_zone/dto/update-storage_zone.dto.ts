import { PartialType } from '@nestjs/swagger';
import { CreateStorageZoneDto } from './create-storage_zone.dto';

export class UpdateStorageZoneDto extends PartialType(CreateStorageZoneDto) {}
