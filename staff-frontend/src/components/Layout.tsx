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
    <Flex direction={{ base: 'column', md: 'row' }} minH="100vh" bg="chakra-body-bg">
      {/* Меню */}
      <Box
        w={{ md: '250px' }}
        position={{ base: 'static', md: 'fixed' }}
        h={{ md: '100vh' }}
        zIndex={isMobile ? 100 : 'sticky'}
      >
        <Menu />
      </Box>

      {/* Основной контент */}
      <Box flex={1} ml={{ md: '250px' }} p={{ base: 4, md: 6 }} minH="100vh">
        {!isMobile && (
          <Box position="absolute" top={4} right={4} display="flex" gap={2}>
            <LanguageSwitcher />
          </Box>
        )}
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
