import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { Review } from './entity/review';

export const getAllReviews = async (): Promise<Review[]> => {
  return getRequest<Review[]>('/review');
};

export const getReview = async (id: string): Promise<Review> => {
  return getRequest<Review>(`/review/${id}`);
};

export const createReview = async (product: Omit<Review, 'id'>): Promise<Review> => {
  return postRequest<Review>('/review', product);
};

export const updateReview = async (id: string, product: Partial<Review>): Promise<Review> => {
  return putRequest<Review>(`/review/${id}`, product);
};

export const deleteReview = async (id: string): Promise<void> => {
  return deleteRequest(`/review/${id}`);
};
