import { PartialType } from '@nestjs/swagger';
import { CreateInventoryMovementDto } from './create-inventory_movement.dto';

export class UpdateInventoryMovementDto extends PartialType(CreateInventoryMovementDto) {}
