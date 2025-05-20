import { getRequest, postRequest, putRequest, deleteRequest } from './request';
import { PriceHistory } from './entity/priceHistory';

export const getAllPriceHistorys = async (): Promise<PriceHistory[]> => {
  return getRequest<PriceHistory[]>('/price-history');
};

export const getPriceHistoryByProduct = async (productID: string): Promise<PriceHistory[]> => {
  return getRequest<PriceHistory[]>(`/price-history/product/${productID}`);
};

export const getPriceHistory = async (id: string): Promise<PriceHistory> => {
  return getRequest<PriceHistory>(`/price-history/${id}`);
};

export const createPriceHistory = async (
  product: Omit<PriceHistory, 'id'>,
): Promise<PriceHistory> => {
  return postRequest<PriceHistory>('/price-history', product);
};

export const updatePriceHistory = async (
  id: string,
  product: Partial<PriceHistory>,
): Promise<PriceHistory> => {
  return putRequest<PriceHistory>(`/price-history/${id}`, product);
};

export const deletePriceHistory = async (id: string): Promise<void> => {
  return deleteRequest(`/price-history/${id}`);
};
