import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNumber, IsString, IsOptional, Min, Max } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateReviewDto extends BaseDto {
  @ApiProperty({ description: 'User who created review' })
  @IsUUID()
  user_id!: string;

  @ApiProperty({ description: 'Product being reviewed', required: false })
  @IsUUID()
  @IsOptional()
  product_id?: string;

  @ApiProperty({ description: 'Order being reviewed', required: false })
  @IsUUID()
  @IsOptional()
  order_id?: string;

  @ApiProperty({ description: 'Rating from 1 to 5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiProperty({ description: 'Review comment', required: false })
  @IsString()
  @IsOptional()
  comment?: string;
}
