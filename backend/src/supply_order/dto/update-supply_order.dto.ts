import { PartialType } from '@nestjs/swagger';
import { CreateSupplyOrderDto } from './create-supply_order.dto';

export class UpdateSupplyOrderDto extends PartialType(CreateSupplyOrderDto) {}
