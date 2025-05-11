import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsStaff } from '../hooks/useIsStaff';
import { useTranslation } from 'react-i18next';

type ProtectedRoleRouteProps = {
  children: ReactNode;
};

const ProtectedRoleRoute = ({ children }: ProtectedRoleRouteProps): React.ReactElement | null => {
  const { isStaff, isLoading } = useIsStaff();
  const { t } = useTranslation();

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  return isStaff ? <>{children}</> : <Navigate to="/forbidden" replace />;
};

export default ProtectedRoleRoute;
