import { Button, Box, Heading } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <Box textAlign="center" mt={20}>
      <Heading mb={4}>Please Log In</Heading>
      <Button
        colorScheme="teal"
        size="lg"
        onClick={() => loginWithRedirect()}
      >
        Log In
      </Button>
    </Box>
  );
};

export default LoginPage;