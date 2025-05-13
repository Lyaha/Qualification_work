import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAccessCheck } from '../hooks/useAccessCheck';
import { Text, Spinner, Center } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type ProtectedRoleRouteProps = {
  children: ReactNode;
};

const ProtectedRoleRoute = ({ children }: ProtectedRoleRouteProps): React.ReactElement | null => {
  const { checkPathAccess, loading } = useAccessCheck();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const checkAccess = async () => {
      console.log(location.pathname);
      const result = await checkPathAccess(location.pathname);
      setHasAccess(result);
    };

    checkAccess();
  }, [checkPathAccess, location.pathname]);

  if (loading || hasAccess === null) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="primary.500" />
        <Text ml={4}>{t('common.loading')}</Text>
      </Center>
    );
  }

  return hasAccess ? <>{children}</> : <Navigate to="/forbidden" replace />;
};

export default ProtectedRoleRoute;
