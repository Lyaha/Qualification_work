import { deleteRequest, getRequest, postRequest, putRequest } from './request';
import { Task } from './entity/task';

export const MyTasks = async (): Promise<Task[]> => {
  return getRequest<Task[]>(`/task/my`);
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
