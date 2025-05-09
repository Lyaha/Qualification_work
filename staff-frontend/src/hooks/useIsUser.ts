import { useState, useCallback } from 'react';
import { User, UserInfo } from '../api';

const useUserSearch = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    try {
      const foundUser = await UserInfo();
      setUser(foundUser);
      return foundUser;
    } catch {
      setError('Пользователь не найден');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, handleSearch };
};

export default useUserSearch;
