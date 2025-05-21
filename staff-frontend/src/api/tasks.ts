import { deleteRequest, getRequest, postRequest, putRequest } from './request';
import { Task } from './entity/task';
import { Batch } from './entity/batch';

export const MyTasks = async (): Promise<Task[]> => {
  return getRequest<Task[]>(`/task/my`);
};

export const getAllTasksWithFilters = async (query: string): Promise<Task[]> => {
  return getRequest<Task[]>(`/tasks?${query}`);
};

export const createTask = async (data: Omit<Task, 'id'>): Promise<Task> => {
  return postRequest<Task>(`/task`, data);
};

export const deleteTask = async (id: string): Promise<void> => {
  return deleteRequest(`/task/${id}`);
};

export const getAllTasks = async (): Promise<Task[]> => {
  return getRequest<Task[]>('/task');
};

export const updateTask = async (id: string, data: Partial<Task>): Promise<Task> => {
  return putRequest<Task>(`/task/${id}`, data);
};

export const completeTask = async (id: string, data: any): Promise<Task> => {
  return putRequest<Task>(`/task/complete/${id}`, data);
};

export const getBatchesForTask = async (id: string): Promise<Batch[]> => {
  return getRequest<Batch[]>(`/task/${id}/batches`);
};
