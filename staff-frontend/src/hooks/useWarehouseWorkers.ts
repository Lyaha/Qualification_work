import { useState, useEffect } from 'react';
import { getWarehouseWorkers, User } from '../api';

export const useWarehouseWorkers = (warehouseId?: string) => {
  const [workers, setWorkers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const data = await getWarehouseWorkers(warehouseId);
      setWorkers(data);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, [warehouseId]);

  return { workers, loading, refresh: fetchWorkers };
};
