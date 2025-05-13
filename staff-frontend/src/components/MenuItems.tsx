import { Box, Text, Stack, Button, Icon } from '@chakra-ui/react';
import { useIsMobile } from '../hooks/useIsMobile';
import { menuIcons } from '../utils/menuIcons';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMenu } from '../hooks/useMenu';
import { useToast } from './ui/toaster';

const MenuContent = () => {
  const isMobile = useIsMobile();
  const { menuItems, loading, error } = useMenu();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toaster = useToast();
  const [toastVisibly, setToastVisibly] = useState(false);

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  useEffect(() => {
    if (error && !toastVisibly) {
      setToastVisibly(true);
      toaster.showToast({
        title: `${t('common.error')}`,
        description: error,
        type: 'error',
        duration: 5000,
      });
    }
    if (!error) {
      setToastVisibly(false);
    }
  }, [error, toaster, toastVisibly, t]);

  if (loading && menuItems!) {
    return <Text>{t('common.loading')}</Text>;
  }

  return (
    <Stack spaceX={3} spaceY={3} p={isMobile ? 4 : 2} mb={isMobile ? 0 : 4}>
      <Box>
        {menuItems?.map((item) => (
          <Button
            key={item.id}
            onClick={() => handleNavigation(item.path)}
            variant="ghost"
            justifyContent="flex-start"
            size="sm"
            w="full"
          >
            {item.icon && menuIcons[item.icon] ? <Icon as={menuIcons[item.icon]} /> : undefined}
            {item.title}
          </Button>
        ))}
      </Box>
    </Stack>
  );
};

export default MenuContent;
