import {
  Box,
  Flex,
  useDisclosure,
  Drawer,
  DrawerHeader,
  Button,
  Link,
  Portal,
} from '@chakra-ui/react';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useColorMode, useColorModeValue } from './ui/color-mode';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';
import { IoMdClose, IoMdMenu } from 'react-icons/io';
import { useAuth0 } from '@auth0/auth0-react';
import UserInfo from './UserInfoBox';
import MenuContent from './MenuItems';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';

const Menu = () => {
  const { onOpen, onClose } = useDisclosure();
  const { toggleColorMode } = useColorMode();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();
  const { logout } = useAuth0();
  const bg_menu = useColorModeValue('#ebebeb', '#163519');
  const { t } = useTranslation();

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Box>
      {/* Десктопное меню */}
      {!isMobile && (
        <Box
          w="250px"
          h="100vh"
          borderRight="1px"
          borderColor="chakra-border-color"
          position="fixed"
          left={0}
          top={0}
          bg={bg_menu}
          display="flex"
          flexDirection="column"
        >
          <Flex p={4} align="center" gap={2} _hover={{ textDecoration: 'none' }}>
            <Box mb={4}>
              <img
                src="/logo.png"
                alt={`${t('system.appName')} Logo`}
                style={{ width: '45px', height: 'auto' }}
              />
            </Box>
            <Link href="/" fontSize="xl" fontWeight="bold">
              {t('system.appName')}
            </Link>
            <Button ml={3} boxSize={8} onClick={toggleColorMode}>
              {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>
          </Flex>
          <Box overflowY="auto" flexGrow={1} p={4}>
            <UserInfo />
            <MenuContent />
          </Box>
          <Flex mt="auto" justify="center" p={4}>
            <Button
              bg="#1ac766"
              color="fg"
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            >
              {t('menu.logout')}
            </Button>
          </Flex>
        </Box>
      )}

      {/* Мобильное меню */}
      {isMobile && (
        <Flex
          p={4}
          justify="space-between"
          align="center"
          borderBottom="1px"
          borderColor="chakra-border-color"
          bg="chakra-body-bg"
        >
          <Drawer.Root key={'start'} placement={'start'}>
            <Drawer.Trigger>
              <Button aria-label="Open menu" onClick={onOpen} variant="ghost">
                <IoMdMenu />
              </Button>
            </Drawer.Trigger>
            <Portal>
              <Drawer.Backdrop />
              <Drawer.Positioner>
                <Drawer.Content>
                  <DrawerHeader>{t('menu.name')}</DrawerHeader>
                  <Drawer.Body>
                    <Drawer.CloseTrigger>
                      <Button aria-label="Close menu" onClick={onClose}>
                        <IoMdClose />
                      </Button>
                    </Drawer.CloseTrigger>
                    <UserInfo />
                    <MenuContent />
                  </Drawer.Body>
                  <Drawer.Footer>
                    <Flex p={4} justify="center" w={'100%'}>
                      <Button
                        bg="#1ac766"
                        color="fg"
                        onClick={() =>
                          logout({ logoutParams: { returnTo: window.location.origin } })
                        }
                      >
                        {t('menu.logout')}
                      </Button>
                    </Flex>
                  </Drawer.Footer>
                </Drawer.Content>
              </Drawer.Positioner>
            </Portal>
          </Drawer.Root>
          <Link href="/" fontSize="xl" fontWeight="bold" color={'#1ac766'}>
            {t('system.appName')}
          </Link>
          <Flex align="center" gap={2}>
            <LanguageSwitcher />
            <Button boxSize={8} onClick={toggleColorMode}>
              {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>
          </Flex>
        </Flex>
      )}
    </Box>
  );
};

export default Menu;
