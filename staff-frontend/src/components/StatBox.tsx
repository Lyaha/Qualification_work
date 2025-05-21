import { Box, Stat } from '@chakra-ui/react';
import { useColorModeValue } from './ui/color-mode';

const StatBox = ({ title, value }: { title: string | any; value: number | any }) => (
  <Box bg={useColorModeValue('white', 'gray.700')} p={4} borderRadius="lg" boxShadow="md">
    <Stat.Root>
      <Stat.Label>{title}</Stat.Label>
      <Stat.ValueText fontSize="2xl">{value}</Stat.ValueText>
    </Stat.Root>
  </Box>
);

export default StatBox;
