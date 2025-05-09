import { Box, Text, Stack } from '@chakra-ui/react';
import { useIsMobile } from '../hooks/useIsMobile';

const MenuContent = () => {
  const isMobile = useIsMobile();

  return (
    <Stack spaceX={3} spaceY={3} p={isMobile ? 4 : 2} mb={isMobile ? 0 : 4}>
      <Box>
        {/* Здесь будут кнопки меню */}
        <Text p={2}>Dashboard</Text>
        <Text p={2}>Settings</Text>
        <Text p={2}>Profile</Text>
      </Box>
    </Stack>
  );
};

export default MenuContent;
