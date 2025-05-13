import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from '../entity/review.entity';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  create(@Body() createReviewDto: Partial<Review>): Promise<Review> {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  findAll(): Promise<Review[]> {
    return this.reviewService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Review> {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: Partial<Review>): Promise<Review> {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.reviewService.remove(id);
  }
}
