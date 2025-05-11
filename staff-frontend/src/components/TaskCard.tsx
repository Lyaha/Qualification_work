import { Box, Flex, Text, Progress, Tag, Icon } from '@chakra-ui/react';
import { differenceInDays, differenceInSeconds, formatDistanceToNow } from 'date-fns';
import { uk, enUS } from 'date-fns/locale';
import { FaBox, FaTruck, FaExclamationCircle } from 'react-icons/fa';
import { useColorModeValue } from './ui/color-mode';
import { useTranslation } from 'react-i18next';

interface TaskCardProps {
  task: {
    id: string;
    type: 'order' | 'supply';
    product: string;
    quantity: number;
    deadline: Date;
    status: 'pending' | 'in_progress' | 'completed';
    client?: string;
    supplier?: string;
    total?: number;
    unitPrice?: number;
    order_item_id?: string;
    supply_order_item_id?: string;
    completed_at?: string;
    note?: string;
  };
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { t, i18n } = useTranslation();
  const deadlineHours = differenceInSeconds(task.deadline, new Date());
  const progressPercent = Math.max(0, Math.min(100, (1 - deadlineHours / 168) * 100));
  const statusColor = {
    pending: 'yellow',
    in_progress: 'blue',
    completed: 'green',
  }[task.status];

  const isUrgent =
    task.status !== 'completed' &&
    differenceInDays(task.deadline, new Date()) <= 0 &&
    differenceInDays(task.deadline, new Date()) >= -1;
  const bg_card = useColorModeValue('#ebebeb', '#454343');

  const typeIcons = {
    order: FaBox,
    supply: FaTruck,
  };

  const dateLocale = i18n.language === 'uk' ? uk : enUS;

  return (
    <Box
      position="relative"
      bg={bg_card}
      borderRadius="md"
      boxShadow="lg"
      mt={4}
      px={3}
      pt={`calc(${3} * 2 + 10px)`}
      pb={3}
    >
      <Box
        position="absolute"
        top={-3}
        left={0}
        bg={bg_card}
        zIndex={-100}
        borderTopRadius={'lg'}
        transform="translateY(-50%)"
      >
        <Tag.Root bg={statusColor + '.500'} p={2} borderRadius={'lg'} h={'100%'} w={'100%'}>
          <Tag.StartElement>
            <Icon as={typeIcons[task.type]} boxSize={4} display={'flex'} />
          </Tag.StartElement>
          <Tag.Label fontSize="sm" fontWeight="bold">
            {t(`tasks.type.${task.type}`)}
          </Tag.Label>
        </Tag.Root>
      </Box>

      <Flex justify="space-between" my={2}>
        {isUrgent && <Icon as={FaExclamationCircle} color="red.500" boxSize={6} />}
        <Text fontSize="sm" color="gray.300">
          {formatDistanceToNow(task.deadline, { addSuffix: true, locale: dateLocale })}
        </Text>
      </Flex>

      <Text fontWeight="bold" mb={2}>
        {task.product}
      </Text>
      <Flex direction="column" gap={2} mb={4}>
        <Text>
          {t('tasks.quantity')}: {task.quantity} {t('common.units')}
          {task.unitPrice && ` × ${task.unitPrice} ₴`}
        </Text>
        <Text color="gray.300">{task.note}</Text>
      </Flex>
      <Progress.Root value={progressPercent} size="xs" colorScheme={statusColor} />
    </Box>
  );
};

export default TaskCard;
