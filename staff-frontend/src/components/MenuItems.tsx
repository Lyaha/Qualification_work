import { Box, Text, Stack } from '@chakra-ui/react';
import { useIsMobile } from '../hooks/useIsMobile';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenu } from '../hooks/useMenu';
import { useToast } from './ui/toaster';
import MenuItemComponent from './MenuItemComponent';

const MenuContent = () => {
  const isMobile = useIsMobile();
  const { menuItems, loading, error } = useMenu();
  const { t } = useTranslation();
  const toaster = useToast();
  const [toastVisibly, setToastVisibly] = useState(false);

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
      <Box>{menuItems?.map((item) => <MenuItemComponent key={item.id} item={item} />)}</Box>
    </Stack>
  );
};

export default MenuContent;
