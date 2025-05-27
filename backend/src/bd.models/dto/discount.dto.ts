import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID, IsEnum, IsNumber, IsDate, IsBoolean, IsOptional } from 'class-validator';
import { DiscountType } from '../entity/discount.entity';
import { BaseDto } from './base.dto';

export class CreateDiscountDto extends BaseDto {
  @ApiProperty({ description: 'Discount name' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Product ID for product-specific discount', required: false })
  @IsUUID()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ description: 'Category ID for category-wide discount', required: false })
  @IsUUID()
  @IsOptional()
  category_id?: string;

  @ApiProperty({ enum: DiscountType, description: 'Type of discount' })
  @IsEnum(DiscountType)
  discount_type!: DiscountType;

  @ApiProperty({ description: 'Discount value (percentage or fixed amount)' })
  @IsNumber()
  value!: number;

  @ApiProperty({ description: 'Discount start date' })
  @IsDate()
  start_date!: Date;

  @ApiProperty({ description: 'Discount end date' })
  @IsDate()
  end_date!: Date;

  @ApiProperty({ default: true, description: 'Is discount active' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
