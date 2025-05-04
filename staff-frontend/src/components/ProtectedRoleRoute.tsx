import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useIsStaff } from '../hooks/useIsStaff';

type ProtectedRoleRouteProps = {
  children: ReactNode;
};

const ProtectedRoleRoute = ({ children }: ProtectedRoleRouteProps): React.ReactElement | null => {
  const { isStaff, isLoading } = useIsStaff();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isStaff ? <>{children}</> : <Navigate to="/forbidden" replace />;
};

export default ProtectedRoleRoute;
