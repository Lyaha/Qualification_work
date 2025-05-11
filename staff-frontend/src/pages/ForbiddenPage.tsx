import { Box, Button, Heading, Link, Text } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import { FaLock, FaSun, FaMoon, FaArrowLeft } from 'react-icons/fa';
import { useAuth0 } from '@auth0/auth0-react';
import { useColorMode } from '../components/ui/color-mode';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

const shake = keyframes`
  0% { transform: translateX(0) }
  25% { transform: translateX(5px) }
  50% { transform: translateX(-5px) }
  75% { transform: translateX(5px) }
  100% { transform: translateX(0) }
`;

const ForbiddenPage = () => {
  const { logout } = useAuth0();
  const { toggleColorMode } = useColorMode();
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Box
      textAlign="center"
      minH="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg="bg"
      px={4}
    >
      <Box position="absolute" top={4} right={4} display="flex" gap={2}>
        <LanguageSwitcher />
        <Button onClick={toggleColorMode} variant="ghost" colorScheme="primary">
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </Button>
      </Box>

      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -10, 10, 0],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <FaLock
          size="120px"
          color="#E53935"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(229, 57, 53, 0.3))',
            marginBottom: '2rem',
          }}
        />
      </motion.div>

      <Heading as="h1" size="2xl" mb={4} color="error.500" fontFamily="Poppins, sans-serif">
        {t('forbidden.title')}
      </Heading>

      <Text fontSize="xl" mb={8} color="text.secondary" maxW="600px">
        {t('forbidden.message')}
      </Text>

      <Box display="flex" gap={4} flexDirection={{ base: 'column', md: 'row' }}>
        <Button
          colorScheme="primary"
          variant="outline"
          size="lg"
          _hover={{ transform: 'translateY(-2px)' }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <FaArrowLeft /> {t('common.backToHome')}
          </Link>
        </Button>
        <Button
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          colorScheme="error"
          variant="solid"
          size="lg"
          _hover={{
            bg: 'error.600',
            animation: `${shake} 0.5s ease-in-out`,
          }}
        >
          <FaLock /> {t('auth.secureLogout')}
        </Button>
      </Box>

      <Text mt={8} fontSize="sm">
        {t('common.needHelp')}{' '}
        <Link
          href="mailto:support@fluxgate.com"
          color="#0f8950"
          _hover={{ color: 'primary.600', textDecoration: 'underline' }}
        >
          support@fluxgate.com
        </Link>
      </Text>
    </Box>
  );
};

export default ForbiddenPage;
