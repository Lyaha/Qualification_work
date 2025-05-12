import { Button, Box, Heading, Grid, Text } from '@chakra-ui/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useTheme } from 'next-themes';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { useColorMode } from '../components/ui/color-mode';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const LoginPage = () => {
  const { loginWithRedirect } = useAuth0();
  const { toggleColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isAuthenticated) {
      navigate('/start');
    }
  }, [navigate, isAuthenticated, isLoading]);

  useEffect(() => setMounted(true), []);

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

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
          position="relative"
        >
          <Box mb={4}>
            <img
              src="/logo.png"
              alt={`${t('system.appName')} Logo`}
              style={{ width: '120px', height: 'auto' }}
            />
          </Box>

          <Heading as="h1" size="xl" mb={4} color="primary.500" fontFamily="heading">
            {t('system.appName')}
          </Heading>

          <Text fontSize="lg" color="text.secondary" mb={8}>
            {t('system.appDescription')}
          </Text>

          <Box position="absolute" top={4} right={4} display="flex" gap={2}>
            <Button onClick={toggleColorMode} variant="ghost" colorScheme="primary">
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </Button>
          </Box>
        </Box>

        {/* Правая часть - Форма входа */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          p={8}
          bg="bg"
          position="relative"
        >
          <Box maxW="400px" w="full">
            <Heading as="h2" size="xl" mb={4} color="text.primary">
              {t('auth.welcome')}
            </Heading>

            <Text mb={8} color="text.secondary">
              {t('auth.staffPortal')}
            </Text>

            <Button
              onClick={() => loginWithRedirect()}
              colorScheme="primary"
              size="lg"
              w="full"
              _hover={{ bg: 'primary.600' }}
            >
              {t('auth.signIn')}
            </Button>
          </Box>
          <Box position="absolute" top={4} left={4} display="flex" gap={2}>
            <LanguageSwitcher />
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default LoginPage;
