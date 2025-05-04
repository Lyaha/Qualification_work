import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

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
    return <div>Loading ...</div>;
  }

  return null;
};

export default HomePage;
