import { Box, Heading } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

const ChartContainer = ({
  title,
  children,
}: {
  title: string | any;
  children: React.ReactNode | any;
}) => (
  <Box bg={useColorModeValue('white', 'gray.700')} p={4} borderRadius="lg" boxShadow="md">
    <Heading size="md" mb={4}>
      {title}
    </Heading>
    {children}
  </Box>
);

export default ChartContainer;
