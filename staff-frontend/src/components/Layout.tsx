import { Flex, Box } from '@chakra-ui/react';
import Menu from './Menu';
import LanguageSwitcher from './LanguageSwitcher';
import { useIsMobile } from '../hooks/useIsMobile';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      minH="100vh"
      bg="chakra-body-bg"
      position="relative"
    >
      {/* Меню */}
      <Box
        w={{ base: '100%', lg: '250px' }}
        position={{ base: 'sticky', lg: 'fixed' }}
        top="0"
        h={{ base: 'auto', lg: '100vh' }}
        zIndex={100}
        bg="chakra-body-bg"
        borderBottom={{ base: '1px solid', lg: 'none' }}
        borderRight={{ base: 'none', lg: '1px solid' }}
        borderColor="chakra-border-color"
      >
        <Menu />
      </Box>

      {/* Основной контент */}
      <Box
        flex={1}
        ml={{ base: 0, lg: '250px' }}
        p={{ base: 3, sm: 4, lg: 6 }}
        minH="100vh"
        maxW={{ base: '100%', lg: 'calc(100% - 250px)' }}
        overflow="auto"
      >
        {!isMobile && (
          <Box position="fixed" top={4} right={4} display="flex" gap={2} zIndex={90}>
            <LanguageSwitcher />
          </Box>
        )}
        <Box pt={{ base: 2, lg: 12 }}>{children}</Box>
      </Box>
    </Flex>
  );
};

export default Layout;
