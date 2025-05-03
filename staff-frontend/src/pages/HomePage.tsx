import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const HomePage = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (isLoading) return;
      if (isAuthenticated) {
        navigate('/start');
      }
    };
    checkAuthAndRedirect();
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return null;
};

export default HomePage;
