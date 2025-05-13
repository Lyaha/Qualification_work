import { Box, Flex, Text, Avatar, useClipboard } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';
import useUserSearch from '../hooks/useIsUser';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from './ui/toaster';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import { User } from '../api';
import { useTranslation } from 'react-i18next';

const UserInfo = () => {
  const border_userinfo = useColorModeValue('#163519', '#ebebeb');
  const { handleSearch, loading, error } = useUserSearch();
  const toaster = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [toastVisibly, setToastVisibly] = useState(false);
  const clipboard = useClipboard({ value: currentUser?.email || '' });
  const { t } = useTranslation();

  const handleCopyEmail = () => {
    if (currentUser?.email) {
      clipboard.copy();
      toaster.showToast({
        title: t('common.emailCopied'),
        description: t('common.emailCopiedDesc'),
        type: 'success',
        duration: 2000,
      });
    }
  };

  const fetchUserData = useCallback(async () => {
    const result = await handleSearch();
    if (result) {
      setCurrentUser(result);
    }
  }, [handleSearch]);

  useVisibilityPolling(fetchUserData, 300000);

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

  if (loading && !currentUser) {
    return <Text>{t('common.loading')}</Text>;
  }

  return (
    <Flex
      align="center"
      p={4}
      gap={3}
      mb={4}
      borderY={'1px solid'}
      borderColor={border_userinfo}
      borderRadius={'md'}
    >
      <Avatar.Root>
        <Avatar.Fallback name={`${currentUser?.first_name} ${currentUser?.last_name}`} />
      </Avatar.Root>
      <Box textAlign="left" maxW={'70%'}>
        <Text fontWeight="bold">
          {currentUser?.first_name} {currentUser?.last_name}
        </Text>
        <Text
          fontSize="sm"
          color="gray.600"
          truncate
          title={currentUser?.email}
          maxW={'100%'}
          cursor="pointer"
          onClick={handleCopyEmail}
          _hover={{ color: '#0fe50e' }}
          transition="color 0.2s"
        >
          {currentUser?.email}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserInfo;
