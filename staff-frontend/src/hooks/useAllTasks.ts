import { useState, useEffect } from 'react';
import { getAllTasks, getAllTasksWithFilters, Task } from '../api';

export const useAllTasks = (filters?: { status?: string; warehouse_id?: string }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters || {});
      const data = params.toString()
        ? await getAllTasksWithFilters(params.toString())
        : await getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters?.status, filters?.warehouse_id]);

  return { tasks, loading, refresh: fetchTasks };
};
