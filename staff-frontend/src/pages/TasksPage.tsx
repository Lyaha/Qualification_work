import { useTranslation } from 'react-i18next';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { useState } from 'react';
import Layout from '../components/Layout';
import { Box, Button, useDisclosure } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { FormField, GenericFormModal } from '../components/GenericModal';
import { GenericDetailView } from '../components/GenericDetailView';
import useCrudOperations from '../hooks/useUnivarsalCRUD';
import useModalNavigation from '../hooks/useModalNavigation';
import useFetchData from '../hooks/useUniversalFetchData';
import useFormHandler from '../hooks/useFormHandler';
import {
  Task,
  createTask,
  getAllTasks,
  updateTask,
  User,
  OrderItem,
  SupplyOrderItem,
  getUsers,
  getAllOrderItems,
  getAllSupplyOrderItems,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const TasksPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const { data: tasks, loading, refetch: fetchTasks } = useFetchData<Task>(getAllTasks);
  const { data: workers } = useFetchData<User>(getUsers);
  const { data: orderItems } = useFetchData<OrderItem>(getAllOrderItems);
  const { data: supplyOrderItems } = useFetchData<SupplyOrderItem>(getAllSupplyOrderItems);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<Task>(fetchTasks, '/task');
  const modalNav = useModalNavigation<Task>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<Task>(
    modalNav.selectedEntity,
    fetchTasks,
    createTask,
    updateTask,
  );

  const columns: ColumnConfig<Task>[] = [
    {
      header: t('tasks.worker'),
      accessor: (item) =>
        workers.find((w) => w.id === item.worker_id)
          ? `${workers.find((w) => w.id === item.worker_id)?.first_name} ${workers.find((w) => w.id === item.worker_id)?.last_name}`
          : t('common.unknown'),
    },
    {
      header: t('tasks.typeFieldName'),
      accessor: (item) => (item.order_item_id ? t('tasks.order') : t('tasks.supply')),
    },
    {
      header: t('tasks.associatedItem'),
      accessor: (item) => {
        if (item.order_item_id) {
          console.log(orderItems, '  ', item.order_item_id);
          const orderItem = orderItems.find((oi) => oi.id === item.order_item_id);
          return `${t('orders.order')} #${orderItem?.id}`;
        }
        const supplyItem = supplyOrderItems.find((soi) => soi.id === item.supply_order_item_id);
        return `${t('supplies.supply')} #${supplyItem?.supply_order_id}`;
      },
    },
    {
      header: t('tasks.quantity'),
      accessor: 'quantity',
      align: 'right',
    },
    {
      header: t('tasks.deadline'),
      accessor: 'deadline',
      format: (date) => new Date(date).toLocaleDateString(),
    },
    {
      header: t('tasks.statusField'),
      accessor: 'status',
      format: (value) => t(`tasks.statuses.${value}`),
    },
  ];

  const taskFields: FormField<Task>[] = [
    {
      name: 'worker_id',
      label: t('tasks.worker'),
      type: 'select',
      options: workers.map((w) => ({ value: w.id, label: `${w.first_name} ${w.last_name}` })),
      required: true,
    },
    {
      name: 'taskType',
      label: t('tasks.taskType'),
      type: 'radio-group',
      options: [
        { value: 'order', label: t('tasks.order') },
        { value: 'supply', label: t('tasks.supply') },
      ],
      required: true,
    },
    {
      name: 'order_item_id',
      label: t('tasks.orderItem'),
      type: 'select',
      options: orderItems.map((oi) => ({
        value: oi.id,
        label: `${t('orders.order')} #${oi.id}`,
      })),
      required: (values) => values.taskType === 'order',
      dependsOn: ['taskType'],
      hidden: (values) => values.taskType !== 'order',
    },
    {
      name: 'supply_order_item_id',
      label: t('tasks.supplyItem'),
      type: 'select',
      options: supplyOrderItems.map((soi) => ({
        value: soi.id,
        label: `${t('supplies.supply')} #${soi.supply_order_id}`,
      })),
      required: (values) => values.taskType === 'supply',
      dependsOn: ['taskType'],
      hidden: (values) => values.taskType !== 'supply',
    },
    {
      name: 'quantity',
      label: t('tasks.quantity'),
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'deadline',
      label: t('tasks.deadline'),
      type: 'date',
      required: true,
    },
    {
      name: 'status',
      label: t('tasks.statusField'),
      type: 'select',
      options: [
        { value: 'pending', label: t('tasks.statuses.pending') },
        { value: 'in_progress', label: t('tasks.statuses.confirmed') },
        { value: 'completed', label: t('tasks.statuses.completed') },
      ],
      required: true,
    },
    {
      name: 'note',
      label: t('tasks.note'),
      type: 'textarea',
    },
  ];

  const handleSubmit = async (data: any) => {
    let selectedId = null;
    if (data.taskType === 'order') {
      if (typeof data.order_item_id === 'string') {
        selectedId = data.order_item_id;
      } else {
        selectedId = data.order_item_id.value[0];
      }
    } else {
      if (typeof data.supply_order_item_id === 'string') {
        selectedId = data.supply_order_item_id;
      } else {
        selectedId = data.supply_order_item_id.value[0];
      }
    }

    let selectedUser = null;
    if (typeof data.worker_id === 'string') {
      selectedUser = data.worker_id;
    } else {
      selectedUser = data.worker_id.value[0];
    }

    let selectedStatus = null;
    if (typeof data.status === 'string') {
      selectedStatus = data.status;
    } else {
      selectedStatus = data.status.value[0];
    }
    const taskData = {
      ...data,
      status: selectedStatus ?? undefined,
      worker_id: selectedUser ?? undefined,
      order_item_id: data.taskType === 'order' ? selectedId : null,
      supply_order_item_id: data.taskType === 'supply' ? selectedId : null,
    };

    delete taskData.taskType;

    if (taskData.status === 'completed') {
      taskData.completed_at = new Date().toISOString();
    }

    await formHandler.handleSubmit(taskData);
    editModal.onClose();
  };

  return (
    <Layout>
      <Box mb={4}>
        <Button onClick={() => navigate(-1)} variant="outline">
          <LuArrowLeft />
          {t('common.back')}
        </Button>
      </Box>

      <GenericTable<Task>
        title={t('tasks.title')}
        items={tasks}
        columns={columns}
        totalItems={tasks.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={PAGE_SIZE}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onAdd={modalNav.handleAdd}
        onEdit={modalNav.handleEdit}
        getId={(item) => item.id}
        isView={true}
        onView={modalNav.handleDetail}
      />

      <GenericFormModal
        isOpen={editModal.open}
        onClose={editModal.onClose}
        initialValues={{
          ...modalNav.selectedEntity,
          taskType: modalNav.selectedEntity?.order_item_id ? 'order' : 'supply',
        }}
        title={modalNav.selectedEntity ? t('tasks.edit') : t('tasks.create')}
        fields={taskFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={`${t('tasks.task')} #${modalNav.selectedEntity?.id}`}
      >
        <GenericDetailView
          items={[
            {
              label: 'tasks.worker',
              value: workers.find((w) => w.id === modalNav.selectedEntity?.worker_id)
                ? `${workers.find((w) => w.id === modalNav.selectedEntity?.worker_id)?.first_name} ${workers.find((w) => w.id === modalNav.selectedEntity?.worker_id)?.last_name}`
                : '-',
            },
            {
              label: 'tasks.typeFieldName',
              value: modalNav.selectedEntity?.order_item_id ? t('tasks.order') : t('tasks.supply'),
            },
            {
              label: 'tasks.associatedItem',
              value: modalNav.selectedEntity?.order_item_id
                ? `${t('orders.order')} #${
                    orderItems.find((oi) => oi.id === modalNav.selectedEntity?.order_item_id)
                      ?.order_id
                  }`
                : `${t('supplies.supply')} #${
                    supplyOrderItems.find(
                      (soi) => soi.id === modalNav.selectedEntity?.supply_order_item_id,
                    )?.supply_order_id
                  }`,
            },
            {
              label: 'tasks.quantity',
              value: modalNav.selectedEntity?.quantity,
            },
            {
              label: 'tasks.deadline',
              value: modalNav.selectedEntity?.deadline
                ? new Date(modalNav.selectedEntity.deadline)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
            {
              label: 'tasks.statusField',
              value: modalNav.selectedEntity?.status,
              format: (value) => t(`tasks.statuses.${value}`),
            },
            {
              label: 'tasks.createdAt',
              value: modalNav.selectedEntity?.created_at
                ? new Date(modalNav.selectedEntity.created_at)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
            {
              label: 'tasks.completedAt',
              value: modalNav.selectedEntity?.completed_at
                ? new Date(modalNav.selectedEntity.completed_at)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
            {
              label: 'tasks.note',
              value: modalNav.selectedEntity?.note || '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default TasksPage;
