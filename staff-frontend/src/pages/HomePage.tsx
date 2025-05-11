import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      navigate('/start');
    } else {
      navigate('/login');
    }
  }, [navigate, isAuthenticated, isLoading]);

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return null;
};

export default HomePage;
