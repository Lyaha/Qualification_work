import { PartialType } from '@nestjs/swagger';
import { CreateSupplyOrderItemDto } from './create-supply_order_item.dto';

export class UpdateSupplyOrderItemDto extends PartialType(CreateSupplyOrderItemDto) {}
