import { Box, Heading, Grid, Text } from '@chakra-ui/react';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';
import TaskLegend from '../components/TaskLegend';
import { useCallback, useEffect, useState } from 'react';
import { Task } from '../api';
import useMyTasks from '../hooks/useTaskUser';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import { useToast } from '../components/ui/toaster';
import { useTranslation } from 'react-i18next';

const StartPage = () => {
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const { handleSearch, error, loading } = useMyTasks();
  const [toastVisibly, setToastVisibly] = useState(false);
  const toaster = useToast();
  const { t } = useTranslation();

  const fetchTaskData = useCallback(async () => {
    const result = await handleSearch();
    if (result) {
      setTasks(result);
    }
  }, [handleSearch]);

  useEffect(() => {
    if (error && !toastVisibly) {
      setToastVisibly(true);
      toaster.showToast({
        title: t('common.error'),
        description: error,
        type: 'error',
        duration: 5000,
      });
    }
    if (!error) {
      setToastVisibly(false);
    }
  }, [error, toaster, toastVisibly, t]);

  useVisibilityPolling(fetchTaskData, 5000);

  if (loading && !tasks) {
    return (
      <Layout>
        <Text>{t('common.loading')}</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>{t('tasks.currentTasks')}</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={{
                id: task.id,
                type: task.order_item_id ? 'order' : 'supply',
                product: t('tasks.unknownProduct'),
                quantity: task.quantity,
                deadline: new Date(task.deadline),
                status: task.status,
                note: task.note,
              }}
            />
          ))}
        </Grid>
      </Box>
      <TaskLegend />
    </Layout>
  );
};

export default StartPage;
