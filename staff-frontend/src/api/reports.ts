import { Discount } from './entity/discount';
import { Product } from './entity/product';
import { Task } from './entity/task';
import { getRequest } from './request';

export type PropsReportsSale = {
  start: Date;
  end: Date;
  warehouse: string | undefined;
};

export const getReportsSale = async (data: PropsReportsSale): Promise<Discount[]> => {
  return await getRequest(
    `/reports/sales?start=${data.start}&end=${data.end}&warehouse=${data.warehouse}`,
  );
};

export const getReportsInventory = async (): Promise<Product[]> => {
  return await getRequest(`/reports/inventory`);
};

export const getReportsTask = async (): Promise<Task[]> => {
  return await getRequest(`/reports/tasks`);
};
