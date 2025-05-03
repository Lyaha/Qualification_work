import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const HomePage = () => {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      if (isLoading) return;
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          if (token) {
            const res = await fetch('http://localhost:8001/users', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!res.ok) {
              console.warn('Failed to fetch profile data:', res.statusText);
              throw new Error('Failed to fetch profile data');
            }
            console.log('Profile data fetched successfully :', res.json());
          }
          else{
            console.warn('Token is null:', token);
          }
        } catch (error) {
          console.error('Error getting access token:', error);
        }
        navigate('/start');
        console.log('User is authenticated, redirecting to start page...');
      } else {
        console.log('User is not authenticated, redirecting to login page...');
        navigate('/login');
      }
    };
    checkAuthAndRedirect();
  }, [isAuthenticated, getAccessTokenSilently]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return null;
};

export default HomePage;