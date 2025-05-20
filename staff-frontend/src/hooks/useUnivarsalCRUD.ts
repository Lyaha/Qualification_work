import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ui/toaster';
import { deleteRequest } from '../api/request';

const useCrudOperations = <T extends { id: string }>(
  fetchData: () => Promise<void>,
  basePath: string,
) => {
  const { t } = useTranslation();
  const toast = useToast();

  const handleDelete = async (id: string) => {
    try {
      await deleteRequest(`${basePath}/${id}`);
      await fetchData();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteRequest(`${basePath}/${id}`)));
      await fetchData();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  return { handleDelete, handleBulkDelete };
};

export default useCrudOperations;
