import { Box, Heading, Button } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import Menu from '../components/Menu';

const StartPage = () => {
  const { logout } = useAuth0();

  return (
    <Box>
      <Menu />
      <Box textAlign="center" mt={20}>
        <Heading mb={4}>Welcome to Your App!</Heading>
        <Button
          colorScheme="red"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          Log Out
        </Button>
      </Box>
    </Box>
  );
};

export default StartPage;
