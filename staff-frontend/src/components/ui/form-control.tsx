import { Box, Text } from '@chakra-ui/react';

const FormControl = ({
  children,
  isInvalid,
  label,
}: {
  children: React.ReactNode;
  isInvalid?: boolean;
  label: string;
}) => (
  <Box mb={4}>
    <Text fontSize="sm" fontWeight="medium" mb={1} color={isInvalid ? 'red.500' : 'inherit'}>
      {label}
    </Text>
    {children}
  </Box>
);

export default FormControl;
