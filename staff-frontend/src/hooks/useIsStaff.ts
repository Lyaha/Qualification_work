import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { setAuthToken } from '../api/axios';
import { checkIsStaff } from '../api/users';
import { useNavigate } from 'react-router-dom';

export const useIsStaff = () => {
  const [isStaff, setIsStaff] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { getAccessTokenSilently, isLoading: authLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const token = await getAccessTokenSilently();
        if (!token) {
          navigate('/login');
          return;
        }
        setAuthToken(token);
        const result = await checkIsStaff();
        setIsStaff(result === true);
        setIsLoading(false);
      } catch (err) {
        console.error('Error checking staff status:', err);
        setIsStaff(false);
        setIsLoading(false);
      }
    };

    verify();
  }, [getAccessTokenSilently, navigate, authLoading]);

  return { isStaff, isLoading };
};
