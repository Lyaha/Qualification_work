import { getRequest } from './request';
import { Task } from './entity/task';

export const MyTasks = async (): Promise<Task[]> => {
  return getRequest<Task[]>(`/task/my`);
};
