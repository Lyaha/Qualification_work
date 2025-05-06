import {
  Box,
  Flex,
  Text,
  Avatar,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  Stack,
  Button,
  Link,
} from '@chakra-ui/react';
import { FaLock, FaMoon, FaSun } from 'react-icons/fa';
import { useColorMode } from './ui/color-mode';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { useIsMobile } from '../hooks/useIsMobile';

const Menu = () => {
  const { open, onOpen, onClose } = useDisclosure();
  const { toggleColorMode } = useColorMode();
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isMobile = useIsMobile();

  const UserInfo = () => (
    <Flex align="center" p={4} gap={3} mb={4}>
      <Avatar.Root>
        <Avatar.Fallback name="Segun Adebayo" />
      </Avatar.Root>
      <Box textAlign="left">
        <Text fontWeight="bold">John Doe</Text>
        <Text fontSize="sm" color="gray.600">
          john.doe@company.com
        </Text>
      </Box>
    </Flex>
  );

  const MenuContent = ({ isMobile = false }) => (
    <Stack spaceX={3} spaceY={3} p={isMobile ? 4 : 0} mb={isMobile ? 0 : 4}>
      <Box divideX="2px">
        {/* Здесь будут кнопки меню */}
        <Text p={2}>Dashboard</Text>
        <Text p={2}>Settings</Text>
        <Text p={2}>Profile</Text>
      </Box>
    </Stack>
  );

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
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
          bg="chakra-body-bg"
        >
          <Flex p={4} align="center" gap={2} _hover={{ textDecoration: 'none' }}>
            <Box mb={4}>
              <img src="/logo.png" alt="FluxGate Logo" style={{ width: '45px', height: 'auto' }} />
            </Box>
            <Link href="/" fontSize="xl" fontWeight="bold">
              FluxGate
            </Link>
            <Button ml={3} boxSize={8} onClick={toggleColorMode}>
              {theme === 'light' ? <FaSun /> : <FaMoon />}
            </Button>
          </Flex>

          <UserInfo />
          <MenuContent />
        </Box>
      )}

      {/* Мобильное меню */}
      {isMobile && (
        <>
          <Flex
            p={4}
            justify="space-between"
            align="center"
            borderBottom="1px"
            borderColor="chakra-border-color"
            bg="chakra-body-bg"
          >
            <Button aria-label="Open menu" onClick={onOpen} variant="ghost">
              <FaLock />
            </Button>
            <Flex align="center" gap={2}>
              <Button boxSize={8} onClick={toggleColorMode}>
                {theme === 'light' ? <FaSun /> : <FaMoon />}
              </Button>
              <Link href="/" fontSize="xl" fontWeight="bold">
                FluxGate
              </Link>
            </Flex>
            <Box w="40px" />
          </Flex>

          <Drawer.Root onClose={onClose} isOpen={open}>
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">
                <Flex align="center" gap={2} bg="chakra-body-bg">
                  <Button boxSize={8} onClick={toggleColorMode}>
                    {theme === 'light' ? <FaSun /> : <FaMoon />}
                  </Button>
                  FluxGate
                </Flex>
              </DrawerHeader>
              <DrawerBody p={0}>
                <UserInfo />
                <MenuContent isMobile />
              </DrawerBody>
            </DrawerContent>
          </Drawer.Root>
        </>
      )}
    </>
  );
};

export default Menu;
