import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional } from 'class-validator';
import { BaseDto } from './base.dto';

export class CreateSupplierDto extends BaseDto {
  @ApiProperty({ example: 'ABC Supplies', description: 'Supplier company name' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'John Doe', required: false, description: 'Contact person name' })
  @IsString()
  @IsOptional()
  contact_person?: string;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'contact@supplier.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}
