import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps): React.ReactElement | null => {
  const { isAuthenticated, isLoading } = useAuth0();
  const { t } = useTranslation();

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
