export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskType = 'order' | 'supply';

export type Task = {
  id: string;
  worker_id: string;
  order_item_id?: string;
  supply_order_item_id?: string;
  quantity: number;
  deadline: string;
  status: TaskStatus;
  created_at: string;
  completed_at?: string;
  note?: string;
  taskType?: TaskType;
};
