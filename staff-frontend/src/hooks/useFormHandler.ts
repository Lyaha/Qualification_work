import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ui/toaster';

const useFormHandler = <T extends Record<string, any>>(
  entity: T | undefined,
  fetchData: () => Promise<void>,
  createFn: (data: Omit<T, 'id'>) => Promise<T>,
  updateFn: (id: string, data: Omit<T, 'id'>) => Promise<T>,
) => {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();

  const handleSubmit = async (data: Omit<T, 'id'>) => {
    setLoading(true);
    try {
      if (entity) {
        await updateFn(entity.id, data);
      } else {
        await createFn(data);
      }
      await fetchData();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.submitFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};

export default useFormHandler;
