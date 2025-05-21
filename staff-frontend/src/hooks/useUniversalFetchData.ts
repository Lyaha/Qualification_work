import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ui/toaster';

const useFetchData = <T>(fetchFn: (params?: any) => Promise<T[]>, params?: any) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchFn(params);
      if (Array.isArray(response)) {
        setData(response);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [fetchFn, params, t, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};

export default useFetchData;
