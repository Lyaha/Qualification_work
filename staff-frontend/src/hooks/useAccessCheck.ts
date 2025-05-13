import { useState, useCallback } from 'react';
import { checkAccess } from '../api/menu';
import { useToast } from '../components/ui/toaster';
import { useTranslation } from 'react-i18next';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api/axios';

export const useAccessCheck = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toaster = useToast();
  const { t } = useTranslation();
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const checkPathAccess = useCallback(
    async (path: string): Promise<boolean> => {
      setLoading(true);
      setError(null);
      try {
        const token = await getAccessTokenSilently();
        if (!token) {
          navigate('/login');
          return false;
        }
        setAuthToken(token);
        const { hasAccess } = await checkAccess(path);
        return hasAccess;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : t('errors.accessCheckFailed');
        setError(errorMessage);
        toaster.showToast({
          title: t('common.error'),
          description: errorMessage,
          type: 'error',
          duration: 5000,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [t, toaster],
  );

  return { checkPathAccess, loading, error };
};
