import { PartialType } from '@nestjs/swagger';
import { CreatePriceHistoryDto } from './create-price_history.dto';

export class UpdatePriceHistoryDto extends PartialType(CreatePriceHistoryDto) {}
