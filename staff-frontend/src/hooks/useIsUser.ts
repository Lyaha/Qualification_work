import { useState, useCallback } from 'react';
import { User, UserInfo } from '../api';
import { useTranslation } from 'react-i18next';

const useUserSearch = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSearch = useCallback(async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const foundUser = await UserInfo();
      setUser(foundUser);
      return foundUser;
    } catch {
      setError(t('errors.userNotFound'));
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, [t]);

  return { user, loading, error, handleSearch };
};

export default useUserSearch;
