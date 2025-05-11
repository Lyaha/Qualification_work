import {
  Button,
  Dialog,
  VStack,
  HStack,
  Icon,
  Box,
  Text,
  Portal,
  CloseButton,
} from '@chakra-ui/react';
import { FaBox, FaExclamationCircle, FaInfoCircle, FaTruck } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const TaskLegend = () => {
  const { t } = useTranslation();

  const legendItems = [
    { icon: FaBox, color: null, text: t('tasks.legendItems.order') },
    { icon: FaTruck, color: null, text: t('tasks.legendItems.supply') },
    { icon: FaExclamationCircle, color: 'red.500', text: t('tasks.legendItems.urgent') },
    { status: 'pending', color: 'yellow.500', text: t('tasks.status.pending') },
    { status: 'in_progress', color: 'blue.500', text: t('tasks.status.inProgress') },
    { status: 'completed', color: 'green.500', text: t('tasks.status.completed') },
  ];

  return (
    <HStack>
      <Dialog.Root>
        <Dialog.Trigger>
          <Button
            aria-label={t('tasks.legend')}
            size="sm"
            position="fixed"
            bottom={4}
            right={4}
            colorScheme="blue"
            zIndex={1000}
            borderRadius="full"
          >
            <FaInfoCircle />
          </Button>
        </Dialog.Trigger>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>{t('tasks.legend')}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body pb={6}>
                <VStack align="stretch" spaceX={4} spaceY={4}>
                  {legendItems.map((item, index) => (
                    <HStack key={index} ml={3} mt={3}>
                      {item.icon && (
                        <Icon as={item.icon} color={item.color || 'current'} boxSize={5} />
                      )}
                      {item.status && <Box w={5} h={5} borderRadius="full" bg={item.color} />}
                      <Text>{item.text}</Text>
                    </HStack>
                  ))}
                </VStack>
              </Dialog.Body>
              <Dialog.CloseTrigger>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </HStack>
  );
};

export default TaskLegend;
