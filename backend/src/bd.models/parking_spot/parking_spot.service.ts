import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ParkingSpot } from '../entity/parking_spot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ParkingSpotService {
  constructor(
    @InjectRepository(ParkingSpot)
    private readonly parkingSpotRepository: Repository<ParkingSpot>,
  ) {}

  create(createParkingSpotDto: Partial<ParkingSpot>): Promise<ParkingSpot> {
    const newParkingSpot = this.parkingSpotRepository.create(createParkingSpotDto);
    return this.parkingSpotRepository.save(newParkingSpot);
  }

  findAll(): Promise<ParkingSpot[]> {
    return this.parkingSpotRepository.find();
  }

  async findOne(id: string): Promise<ParkingSpot> {
    const parkingSpot = await this.parkingSpotRepository.findOne({ where: { id } });
    if (!parkingSpot) {
      throw new NotFoundException(`ParkingSpot with ID ${id} not found`);
    }
    return parkingSpot;
  }

  async update(id: string, updateParkingSpotDto: Partial<ParkingSpot>): Promise<ParkingSpot> {
    const parkingSpot = await this.findOne(id);
    const updatedParkingSpot = this.parkingSpotRepository.merge(parkingSpot, updateParkingSpotDto);
    return this.parkingSpotRepository.save(updatedParkingSpot);
  }

  async remove(id: string): Promise<void> {
    const parkingSpot = await this.findOne(id);
    await this.parkingSpotRepository.remove(parkingSpot);
  }
}
