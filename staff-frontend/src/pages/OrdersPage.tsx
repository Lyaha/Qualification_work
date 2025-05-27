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
  Order,
  OrderStatus,
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
  User,
  Warehouse,
  getClients,
  getWarehouses,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const OrdersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const { data: orders, loading, refetch: fetchOrders } = useFetchData<Order>(getAllOrders);
  const { data: clients } = useFetchData<User>(getClients);
  const { data: warehouses } = useFetchData<Warehouse>(getWarehouses);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<Order>(fetchOrders, '/order');
  const modalNav = useModalNavigation<Order>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<Order>(
    modalNav.selectedEntity,
    fetchOrders,
    createOrder,
    updateOrder,
  );

  const columns: ColumnConfig<Order>[] = [
    {
      header: t('orders.client'),
      accessor: (item) =>
        clients.find((c) => c.id === item.client_id)
          ? `${clients.find((c) => c.id === item.client_id)?.first_name} ${clients.find((c) => c.id === item.client_id)?.last_name} `
          : t('common.unknown'),
    },
    {
      header: t('orders.totalAmount'),
      accessor: 'total_amount',
      format: (value) => `${value}  ${t('units.currency')}`,
      align: 'right',
    },
    {
      header: t('orders.status'),
      accessor: 'status',
      format: (value) => t(`orders.statuses.${value}`),
    },
    {
      header: t('orders.paymentMethod'),
      accessor: 'payment_method',
      format: (value) => value || '-',
    },
    {
      header: t('orders.warehouse'),
      accessor: (item) =>
        warehouses.find((w) => w.id === item.warehouse_id)?.name || t('common.unknown'),
    },
    {
      header: t('orders.createdAt'),
      accessor: 'created_at',
      format: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const orderFields: FormField<Order>[] = [
    {
      name: 'client_id',
      label: t('orders.client'),
      type: 'select',
      options: clients.map((c) => ({ value: c.id, label: `${c.first_name} ${c.last_name}` })),
      required: true,
    },
    {
      name: 'warehouse_id',
      label: t('orders.warehouse'),
      type: 'select',
      options: warehouses.map((w) => ({ value: w.id, label: w.name })),
      required: true,
    },
    {
      name: 'total_amount',
      label: t('orders.totalAmount'),
      type: 'number',
      required: true,
      min: 0.01,
      step: 0.01,
    },
    {
      name: 'status',
      label: t('orders.status'),
      type: 'select',
      options: [
        { value: 'pending', label: t('`orders.statuses.pending') },
        { value: 'confirmed', label: t('orders.statuses.confirmed') },
        { value: 'completed', label: t('`orders.statuses.completed') },
        { value: 'canceled', label: t('orders.statuses.canceled') },
      ],
      required: true,
    },
    {
      name: 'payment_method',
      label: t('orders.paymentMethod'),
      type: 'select',
      options: [
        { value: 'credit_card', label: t('orders.paymentMethods.credit_card') },
        { value: 'cash', label: t('orders.paymentMethods.cash') },
        { value: 'bank_transfer', label: t('orders.paymentMethods.bank_transfer') },
      ],
      required: (values) => values.status === 'completed',
    },
  ];

  const handleSubmit = async (data: Partial<Order>) => {
    if (!data.status || !data.client_id || !data.warehouse_id || !data.total_amount) {
      throw new Error(t('errors.requiredFieldsMissing'));
    }
    await formHandler.handleSubmit({
      created_at: data.created_at ?? new Date().toISOString(),
      client_id: data.client_id,
      warehouse_id: data.warehouse_id,
      status: data.status,
      total_amount: parseFloat(data.total_amount as unknown as string),
      payment_method: data.payment_method,
    });
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

      <GenericTable<Order>
        title={t('orders.title')}
        items={orders}
        columns={columns}
        totalItems={orders.length}
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
        initialValues={modalNav.selectedEntity}
        title={modalNav.selectedEntity ? t('orders.edit') : t('orders.create')}
        fields={orderFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={`${t('orders.order')} #${modalNav.selectedEntity?.id}`}
      >
        <GenericDetailView
          items={[
            {
              label: 'orders.client',
              value: clients.find((c) => c.id === modalNav.selectedEntity?.client_id)
                ? `${clients.find((c) => c.id === modalNav.selectedEntity?.client_id)?.first_name} ${clients.find((c) => c.id === modalNav.selectedEntity?.client_id)?.last_name}`
                : '-',
            },
            {
              label: 'orders.warehouse',
              value: warehouses.find((w) => w.id === modalNav.selectedEntity?.warehouse_id)?.name,
            },
            {
              label: 'orders.totalAmount',
              value: modalNav.selectedEntity?.total_amount as number | undefined,
              format: (value) => `${Number(value).toFixed(2)}  ${t('units.currency')}`,
            },
            {
              label: 'orders.status',
              value: modalNav.selectedEntity?.status,
              format: (value) => t(`orders.statuses.${value}`),
            },
            {
              label: 'orders.paymentMethod',
              value: modalNav.selectedEntity?.payment_method
                ? t(`orders.paymentMethods.${modalNav.selectedEntity.payment_method}`)
                : '-',
            },
            {
              label: 'orders.createdAt',
              value: modalNav.selectedEntity?.created_at
                ? new Date(modalNav.selectedEntity.created_at)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default OrdersPage;
