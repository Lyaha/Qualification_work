import { Box, Heading, Grid, Text, Button, useDisclosure, Collapsible } from '@chakra-ui/react';
import Layout from '../components/Layout';
import TaskCard, { ItemTaskCard } from '../components/TaskCard';
import TaskDialog from '../components/TaskDialog';
import ManagerTaskView from '../components/ManagerTaskView';
import { useCallback, useEffect, useState } from 'react';
import {
  Task,
  Batch,
  User,
  completeTask,
  getBatchesForTask,
  getProduct,
  getOrderItem,
  getSupplyOrderItem,
  getSupplyOrder,
  getSupplier,
} from '../api';
import useMyTasks from '../hooks/useTaskUser';
import { useToast } from '../components/ui/toaster';
import { useTranslation } from 'react-i18next';
import { useAllTasks } from '../hooks/useAllTasks';
import { useWarehouseWorkers } from '../hooks/useWarehouseWorkers';
import { useUser } from '../context/UserContext';

const transformTaskToItem = async (task: Task): Promise<ItemTaskCard> => {
  // Запросы к API для получения дополнительных данных
  if (!task.order_item_id && !task.supply_order_item_id) {
    throw new Error(`Selected Task not have order item and supply item`);
  }
  let response1;
  if (task.order_item_id) {
    response1 = await getOrderItem(task.order_item_id);
  } else if (task.supply_order_item_id) {
    response1 = await getSupplyOrderItem(task.supply_order_item_id);
  }
  if (!response1) {
    throw new Error(`Selected Task not have order item and supply item`);
  }
  const productData = await getProduct(response1.product_id);
  if (!task.order_item_id && !task.supply_order_item_id) {
    throw new Error(`Selected Task not have order item and supply item`);
  }
  let response2;
  let response3;
  if (task.supply_order_item_id) {
    response2 = await getSupplyOrderItem(task.supply_order_item_id);
  }
  if (response2) {
    response3 = await getSupplyOrder(response2.supply_order_id);
  }
  const clientSupplierData = response3 ? await getSupplier(response3.supplier_id) : undefined;

  return {
    ...task,
    deadline: new Date(task.deadline),
    type: task.order_item_id ? 'order' : 'supply',
    product: productData.name,
    ...clientSupplierData,
  };
};

const StartPage = () => {
  const { user } = useUser();
  const [loadingPage, setLoading] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<ItemTaskCard | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const { open, onOpen, onClose } = useDisclosure();
  const [showArchive, setShowArchive] = useState(false);
  const [toastVisibly, setToastVisibly] = useState(false);
  const toaster = useToast();
  const { t } = useTranslation();

  // Состояния для преобразованных задач
  const [myTasks, setMyTasks] = useState<ItemTaskCard[]>([]);
  const [allTasks, setAllTasks] = useState<ItemTaskCard[]>([]);

  // Получение и преобразование данных
  const { tasks: rawMyTasks, error, loading, handleSearch } = useMyTasks();
  const { tasks: rawAllTasks, refresh: fetchAllTasks } = useAllTasks();
  const { workers, refresh: fetchWorkers } = useWarehouseWorkers();

  useEffect(() => {
    const transformTasks = async () => {
      if (rawMyTasks) {
        const transformed = await Promise.all(rawMyTasks.map(transformTaskToItem));
        setMyTasks(transformed);
      }
    };
    transformTasks();
    fetchWorkers();
  }, [rawMyTasks]);

  useEffect(() => {
    const transformTasks = async () => {
      if (rawAllTasks) {
        const transformed = await Promise.all(rawAllTasks.map(transformTaskToItem));
        setAllTasks(transformed);
      }
    };
    transformTasks();
    fetchWorkers();
  }, [rawAllTasks]);

  // Фильтрация задач
  const activeTasks = myTasks.filter((t) => t.status !== 'completed');
  const archivedTasks = myTasks.filter((t) => t.status === 'completed');
  const unassignedTasks = allTasks.filter((t) => !t.worker_id);
  const inProgressTasks = allTasks.filter((t) => t.status === 'in_progress');
  const adminArchivedTasks = allTasks.filter((t) => t.status === 'completed');

  // Обработчик клика по задаче
  const handleTaskClick = async (task: ItemTaskCard) => {
    console.log('Ok');
    setSelectedTask(task);
    console.log(task);
    fetchBatchesForTask(task);
    onOpen();
  };

  const fetchBatchesForTask = useCallback(
    async (taskProp: ItemTaskCard) => {
      try {
        setLoading(true);
        if (!taskProp) {
          console.log(`Selected Task its null`);
          throw new Error(`Selected Task its null`);
        }
        const task = rawAllTasks.find((t) => t.id === taskProp.id);
        if (!task) {
          console.log(`Selected Task its null 2`);
          throw new Error(`Selected Task its null`);
        }
        const response = await getBatchesForTask(task.id);
        setBatches(response);
      } catch (error) {
        toaster.showToast({ title: t('errors.loadingFailed'), type: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [t, toaster, rawAllTasks],
  );

  const handleCompleteTask = async (data: {
    batchId: string;
    quantity: number;
    workerId?: string;
  }) => {
    try {
      await completeTask(selectedTask!.id, data);
      onClose();
      user?.role === 'warehouse_worker' ? handleSearch() : fetchAllTasks();
    } catch (error) {
      if (error && !toastVisibly) {
        setToastVisibly(true);
        ({ title: t('errors.loadingFailed'), type: 'error' });
      }
    }
  };

  if (loading || loadingPage) {
    return (
      <Layout>
        <Text>{t('common.loading')}</Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p={4}>
        {user?.role === 'warehouse_worker' ? (
          <>
            <Heading mb={6}>{t('tasks.currentTasks')}</Heading>
            <Grid>
              {activeTasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => handleTaskClick(task)} />
              ))}
            </Grid>

            <Button mt={4} onClick={() => setShowArchive(!showArchive)}>
              {t(showArchive ? 'tasks.hideArchive' : 'tasks.showArchive')}
            </Button>

            <Collapsible.Root open={showArchive}>
              <Grid mt={4} gap={6}>
                {archivedTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </Grid>
            </Collapsible.Root>
          </>
        ) : (
          <ManagerTaskView
            unassignedTasks={unassignedTasks}
            inProgressTasks={inProgressTasks}
            archivedTasks={adminArchivedTasks}
            workers={workers}
            onTaskClick={handleTaskClick}
          />
        )}
      </Box>

      <TaskDialog
        isOpen={open}
        onClose={onClose}
        task={selectedTask}
        batches={batches}
        workers={workers}
        onSubmit={handleCompleteTask}
        userRole={user?.role}
      />
    </Layout>
  );
};

export default StartPage;
