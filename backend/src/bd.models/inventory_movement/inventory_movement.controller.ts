import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { InventoryMovementService } from './inventory_movement.service';
import { InventoryMovement } from '../entity/inventory_movement.entity';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateInventoryMovementDto } from '../dto/inventory-movement.dto';

@ApiTags('Inventory Movements')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('inventory-movement')
export class InventoryMovementController {
  constructor(private readonly inventoryMovementService: InventoryMovementService) {}

  @Post()
  @ApiOperation({ summary: 'Create new inventory movement' })
  @ApiResponse({ status: 201, type: InventoryMovement })
  create(@Body() createDto: CreateInventoryMovementDto): Promise<InventoryMovement> {
    return this.inventoryMovementService.create(createDto);
  }

  @Get()
  findAll(): Promise<InventoryMovement[]> {
    return this.inventoryMovementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<InventoryMovement> {
    return this.inventoryMovementService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInventoryMovementDto: Partial<InventoryMovement>,
  ): Promise<InventoryMovement> {
    return this.inventoryMovementService.update(id, updateInventoryMovementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.inventoryMovementService.remove(id);
  }
}
