import { Injectable } from '@nestjs/common';
import { Review } from '../entity/review.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly usersRepository: Repository<Review>,
  ) {}

  async create(createReviewDto: Partial<Review>): Promise<Review> {
    const newReview = this.usersRepository.create(createReviewDto);
    return this.usersRepository.save(newReview);
  }

  findAll(): Promise<Review[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.usersRepository.findOne({ where: { id } });
    if (!review) {
      throw new Error(`Review with ID ${id} not found`);
    }
    return review;
  }

  async update(id: string, updateReviewDto: Partial<Review>): Promise<Review> {
    const review = await this.findOne(id);
    const updatedReview = this.usersRepository.merge(review, updateReviewDto);
    return this.usersRepository.save(updatedReview);
  }

  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);
    await this.usersRepository.remove(review);
  }
}
