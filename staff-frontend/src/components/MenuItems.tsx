import { Box, Text, Stack, useMenu, Button, Icon } from '@chakra-ui/react';
import { useIsMobile } from '../hooks/useIsMobile';
import { MenuItem } from '../api/menu';
import { menuIcons } from '../utils/menuIcons';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from './ui/toaster';
import { useTranslation } from 'react-i18next';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import { useNavigate } from 'react-router-dom';

const MenuContent = () => {
  const isMobile = useIsMobile();
  const { handleSearch, loading, error } = useMenu();
  const toaster = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [toastVisibly, setToastVisibly] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigation = useCallback(
    (path: string) => {
      navigate(path);
    },
    [navigate],
  );

  const fetchUserData = useCallback(async () => {
    const result = await handleSearch();
    if (result) {
      setMenuItems(result);
    }
  }, [handleSearch]);

  useVisibilityPolling(fetchUserData, 5000);

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

  if (loading && !menuItems) {
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
            {item.id}
          </Button>
        ))}
      </Box>
    </Stack>
  );
};

export default MenuContent;
