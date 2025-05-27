import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { UserRole } from '../entity/user.entity';
import { BaseDto } from './base.dto';

export class CreateUserDto extends BaseDto {
  @ApiProperty({ example: 'John', description: 'User first name' })
  @IsString()
  first_name!: string;

  @ApiProperty({ example: 'Doe', description: 'User last name' })
  @IsString()
  last_name!: string;

  @ApiProperty({ example: 'auth0|123', description: 'Auth0 user ID' })
  @IsString()
  auth0_id!: string;

  @ApiProperty({ example: 'john@example.com', description: 'User email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: UserRole, description: 'User role in system' })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({ example: '+1234567890', required: false })
  @IsOptional()
  @IsString()
  phone_number?: string;

  @ApiProperty({ default: true, description: 'User account status' })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}

export class UpdateUserDto extends CreateUserDto {}
