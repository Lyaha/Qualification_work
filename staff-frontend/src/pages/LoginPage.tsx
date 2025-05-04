import { Button, Box, Heading, Grid, Text } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useColorMode } from '../components/ui/color-mode';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  const { toggleColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="bg">
      <Grid
        templateColumns={{ base: '1fr', md: '1fr 1fr' }}
        maxW="900px"
        w="90%"
        boxShadow="lg"
        borderRadius="xl"
        overflow="hidden"
      >
        {/* Левая часть - Лого и тема */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={8}
          borderColor="border"
          bg="#0f8950"
        >
          <Box mb={4}>
            <img src="/logo.png" alt="FluxGate Logo" style={{ width: '120px', height: 'auto' }} />
          </Box>

          <Heading as="h1" size="xl" mb={4} color="primary.500" fontFamily="heading">
            FluxGate
          </Heading>

          <Text fontSize="lg" color="text.secondary" mb={8}>
            Warehouse Management System
          </Text>

          <Button
            onClick={toggleColorMode}
            variant="ghost"
            colorScheme="primary"
            position="absolute"
            top={4}
            right={4}
          >
            {theme === 'dark' ? <FaSun /> : <FaMoon />}{' '}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </Box>

        {/* Правая часть - Форма входа */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={8}
          bg="bg"
        >
          <Box maxW="400px" w="full">
            <Heading as="h2" size="xl" mb={4} color="text.primary">
              Welcome to FluxGate
            </Heading>

            <Text mb={8} color="text.secondary">
              Staff Portal - Please sign in to continue
            </Text>

            <Button
              onClick={() => loginWithRedirect()}
              colorScheme="primary"
              size="lg"
              w="full"
              _hover={{ bg: 'primary.600' }}
            >
              Sign In with Company Account
            </Button>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default LoginPage;
