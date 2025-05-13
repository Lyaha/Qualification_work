import { Injectable, NotFoundException } from '@nestjs/common';
import { PriceHistory } from '../entity/price_history.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PriceHistoryService {
  constructor(
    @InjectRepository(PriceHistory)
    private readonly priceHistorysRepository: Repository<PriceHistory>,
  ) {}

  async create(createPriceHistoryDto: Partial<PriceHistory>): Promise<PriceHistory> {
    const newPriceHistory = this.priceHistorysRepository.create(createPriceHistoryDto);
    return this.priceHistorysRepository.save(newPriceHistory);
  }

  findAll(): Promise<PriceHistory[]> {
    return this.priceHistorysRepository.find();
  }

  async findOne(id: string) {
    const priceHistory = await this.priceHistorysRepository.findOne({ where: { id } });
    if (!priceHistory) {
      throw new NotFoundException(`PriceHistory with ID ${id} not found`);
    }
    return priceHistory;
  }

  async update(id: string, updatePriceHistoryDto: Partial<PriceHistory>): Promise<PriceHistory> {
    const priceHistory = await this.findOne(id);
    const updatedPriceHistory = this.priceHistorysRepository.merge(
      priceHistory,
      updatePriceHistoryDto,
    );
    return this.priceHistorysRepository.save(updatedPriceHistory);
  }

  async remove(id: string): Promise<void> {
    const priceHistory = await this.findOne(id);
    await this.priceHistorysRepository.remove(priceHistory);
  }
}
