import { useState, useCallback } from 'react';
import { MyTasks, Task } from '../api';
import { useTranslation } from 'react-i18next';

const useMyTasks = () => {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSearch = useCallback(async (): Promise<Task[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const foundTasks = await MyTasks();
      setTasks(foundTasks);
      return foundTasks;
    } catch {
      setError(t('errors.loadingFailed'));
      setTasks(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [t]);

  return { tasks, loading, error, handleSearch };
};

export default useMyTasks;
