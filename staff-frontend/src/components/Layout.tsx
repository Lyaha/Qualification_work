import { Flex, Box } from '@chakra-ui/react';
import Menu from './Menu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} minH="100vh" bg="chakra-body-bg">
      {/* Меню */}
      <Box
        w={{ md: '250px' }}
        position={{ base: 'static', md: 'fixed' }}
        h={{ md: '100vh' }}
        zIndex="sticky"
      >
        <Menu />
      </Box>

      {/* Основной контент */}
      <Box flex={1} ml={{ md: '250px' }} p={{ base: 4, md: 6 }} minH="100vh">
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
