import { Box, Flex, Text, Avatar } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';
import useUserSearch from '../hooks/useIsUser';
import { useEffect, useState, useCallback } from 'react';
import { useToast } from './ui/toaster';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import { User } from '../api';

const UserInfo = () => {
  const border_userinfo = useColorModeValue('#163519', '#ebebeb');
  const { handleSearch, loading, error } = useUserSearch();
  const toaster = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUserData = useCallback(async () => {
    const result = await handleSearch();
    if (result) {
      setCurrentUser(result);
    }
  }, [handleSearch]);

  useVisibilityPolling(fetchUserData, 5000);

  useEffect(() => {
    if (error) {
      toaster.showToast({
        title: 'Ошибка!',
        description: error,
        type: 'error',
        duration: 5000,
      });
    }
  }, [error, toaster]);

  if (loading && !currentUser) {
    return <Text>Loading...</Text>;
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
        <Text fontSize="sm" color="gray.600" truncate title={currentUser?.email} maxW={'100%'}>
          {currentUser?.email}
        </Text>
      </Box>
    </Flex>
  );
};

export default UserInfo;
