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
  UserRole,
  getOrder,
  UserWarehouse,
} from '../api';
import useMyTasks from '../hooks/useTaskUser';
import { useToast } from '../components/ui/toaster';
import { useTranslation } from 'react-i18next';
import { useAllTasks } from '../hooks/useAllTasks';
import { useWarehouseWorkers } from '../hooks/useWarehouseWorkers';
import useUserSearch from '../hooks/useIsUser';
import useVisibilityPolling from '../hooks/useVisibilityPolling';

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
  const [user, setCurrentUser] = useState<User | null>(null);
  const { handleSearch: userSearch, loading: userLoading, error: UserError } = useUserSearch();
  const [loadingPage, setLoading] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<ItemTaskCard | null>(null);
  const [batches, setBatches] = useState<Batch[]>([]);
  const { open, onOpen, onClose } = useDisclosure();
  const [showArchive, setShowArchive] = useState(false);
  const [toastVisibly, setToastVisibly] = useState(false);
  const [userWarehouses, setUsersWarehouses] = useState<UserWarehouse[]>([]);
  const toaster = useToast();
  const { t } = useTranslation();
  // Состояния для преобразованных задач
  const [myTasks, setMyTasks] = useState<ItemTaskCard[]>([]);
  const [allTasks, setAllTasks] = useState<ItemTaskCard[]>([]);
  const [managerTasks, setManagerTasks] = useState<ItemTaskCard[]>([]); // Добавлено для менеджера

  // Получение и преобразование данных
  const { tasks: rawMyTasks, error, loading, handleSearch } = useMyTasks();
  const { tasks: rawAllTasks, refresh: fetchAllTasks } = useAllTasks();
  const { workers, refresh: fetchWorkers } = useWarehouseWorkers();

  const fetchUserData = useCallback(async () => {
    const result = await userSearch();
    if (result) {
      setCurrentUser(result);
    }
  }, [userSearch]);

  useVisibilityPolling(fetchUserData, 300000);

  // Фильтрация задач для менеджера
  const getWarehouseIdForTask = async (task: Task): Promise<string | null> => {
    try {
      if (task.order_item_id) {
        const orderItem = await getOrderItem(task.order_item_id);
        const order = await getOrder(orderItem.order_id);
        return order.warehouse_id;
      } else if (task.supply_order_item_id) {
        const supplyOrderItem = await getSupplyOrderItem(task.supply_order_item_id);
        const supplyOrder = await getSupplyOrder(supplyOrderItem.supply_order_id);
        return supplyOrder.warehouse_id;
      }
      return null;
    } catch (error) {
      console.error('Error fetching warehouse for task:', error);
      return null;
    }
  };

  // Загрузка задач для менеджера
  useEffect(() => {
    if (!user || user.role !== 'manager' || !rawAllTasks) return;

    const loadManagerTasks = async () => {
      const managerWarehouseIds =
        userWarehouses?.filter((wh) => wh.user_id === user.id).map((wh) => wh.id) || [];
      const tasksWithWarehouses = await Promise.all(
        rawAllTasks.map(async (task) => {
          const warehouseId = await getWarehouseIdForTask(task);
          return { ...task, warehouse_id: warehouseId };
        }),
      );

      const filteredTasks = tasksWithWarehouses.filter(
        (task) => task.warehouse_id && managerWarehouseIds.includes(task.warehouse_id),
      );

      const transformed = await Promise.all(filteredTasks.map(transformTaskToItem));
      setManagerTasks(transformed);
    };

    loadManagerTasks();
  }, [rawAllTasks, user]);

  // Загрузка задач для рабочего
  useEffect(() => {
    const transformTasks = async () => {
      if (rawMyTasks) {
        const transformed = await Promise.all(rawMyTasks.map(transformTaskToItem));
        setMyTasks(transformed);
      }
    };
    transformTasks();
  }, [rawMyTasks]);

  // Загрузка задач для админа/директора
  useEffect(() => {
    const transformTasks = async () => {
      if (rawAllTasks && (user?.role === 'admin' || user?.role === 'director')) {
        const transformed = await Promise.all(rawAllTasks.map(transformTaskToItem));
        setAllTasks(transformed);
      }
    };
    transformTasks();
  }, [rawAllTasks, user?.role]);

  // Фильтрация задач по ролям
  const getFilteredTasks = () => {
    console.log(user?.role);
    if (!user) return { active: [], archived: [] };
    console.log(user.role);

    switch (user.role) {
      case 'warehouse_worker':
        return {
          active: myTasks.filter((t) => t.status !== 'completed'),
          archived: myTasks.filter((t) => t.status === 'completed'),
        };

      case 'manager':
        return {
          active: managerTasks.filter((t) => t.status !== 'completed'),
          archived: managerTasks.filter((t) => t.status === 'completed'),
        };

      case 'admin':
      case 'director':
        return {
          active: allTasks.filter((t) => t.status !== 'completed'),
          archived: allTasks.filter((t) => t.status === 'completed'),
        };

      default:
        return { active: [], archived: [] };
    }
  };

  const { active: activeTasks, archived: archivedTasks } = getFilteredTasks();

  // Для ManagerTaskView
  const unassignedTasks =
    user?.role === 'manager'
      ? managerTasks.filter((t) => !t.worker_id)
      : allTasks.filter((t) => !t.worker_id);

  const inProgressTasks =
    user?.role === 'manager'
      ? managerTasks.filter((t) => t.status === 'in_progress')
      : allTasks.filter((t) => t.status === 'in_progress');

  const adminArchivedTasks =
    user?.role === 'manager'
      ? managerTasks.filter((t) => t.status === 'completed')
      : allTasks.filter((t) => t.status === 'completed');

  // Обработчик клика по задаче
  const handleTaskClick = async (task: ItemTaskCard) => {
    setSelectedTask(task);
    fetchBatchesForTask(task);
    onOpen();
  };

  const fetchBatchesForTask = useCallback(
    async (taskProp: ItemTaskCard) => {
      try {
        setLoading(true);
        if (!taskProp) {
          throw new Error(`Selected Task its null`);
        }
        const task = rawAllTasks.find((t) => t.id === taskProp.id);
        if (!task) {
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
        {user?.role === ('warehouse_worker' as UserRole) ? (
          <>
            <Heading mb={6}>{t('tasks.currentTasks')}</Heading>
            <Grid gap={6} mb={4}>
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
