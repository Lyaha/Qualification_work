import React from 'react';
import { Box, Button, Heading, Text } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

const ForbiddenPage = () => {
  const { logout } = useAuth0();
  return (
    <Box textAlign="center" mt="100px">
      <Heading as="h1" size="2xl" mb={4}>
        Access denied
      </Heading>
      <Text fontSize="lg">You do not have permission to access this page.</Text>
      <Button
        colorScheme="red"
        onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
      >
        Log Out
      </Button>
    </Box>
  );
};

export default ForbiddenPage;
