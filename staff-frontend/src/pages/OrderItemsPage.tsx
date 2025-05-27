import { useTranslation } from 'react-i18next';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { useState } from 'react';
import Layout from '../components/Layout';
import { Box, Button, useDisclosure, Text } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import { FormField, GenericFormModal } from '../components/GenericModal';
import { DetailItem, GenericDetailView } from '../components/GenericDetailView';
import useCrudOperations from '../hooks/useUnivarsalCRUD';
import useModalNavigation from '../hooks/useModalNavigation';
import useFetchData from '../hooks/useUniversalFetchData';
import useFormHandler from '../hooks/useFormHandler';
import {
  OrderItem,
  createOrderItem,
  getAllOrderItems,
  updateOrderItem,
  Order,
  Product,
  getAllOrders,
  getProducts,
  getOrderItemsByOrderId,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const OrderItemsPage = () => {
  const { t } = useTranslation();
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const {
    data: orderItems,
    loading,
    refetch: fetchOrderItems,
  } = useFetchData<OrderItem>(orderId ? () => getOrderItemsByOrderId(orderId) : getAllOrderItems);
  const { data: orders } = useFetchData<Order>(getAllOrders);
  const { data: products } = useFetchData<Product>(getProducts);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<OrderItem>(
    fetchOrderItems,
    '/order-item',
  );
  const modalNav = useModalNavigation<OrderItem>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<OrderItem>(
    modalNav.selectedEntity,
    fetchOrderItems,
    createOrderItem,
    updateOrderItem,
  );

  const columns: ColumnConfig<OrderItem>[] = [
    {
      header: t('orderItems.order'),
      accessor: (item) => `Order #${orders.find((o) => o.id === item.order_id)?.id.slice(0, 8)}`,
      hidden: !!orderId,
    },
    {
      header: t('orderItems.product'),
      accessor: (item) =>
        products.find((p) => p.id === item.product_id)?.name || t('common.unknown'),
    },
    {
      header: t('orderItems.quantity'),
      accessor: 'quantity',
      align: 'right',
    },
    {
      header: t('orderItems.unitPrice'),
      accessor: 'unit_price',
      format: (value) => `${value}  ${t('units.currency')}`,
      align: 'right',
    },
    {
      header: t('orderItems.total'),
      accessor: (item) => `${item.quantity * item.unit_price}  ${t('units.currency')}`,
      align: 'right',
    },
  ];

  const orderItemFields: FormField<OrderItem>[] = [
    {
      name: 'order_id',
      label: t('orderItems.order'),
      type: 'select',
      options: orders.map((o) => ({
        value: o.id,
        label: `Order #${o.id.slice(0, 8)}`,
      })),
      required: true,
      hidden: !!orderId,
    },
    {
      name: 'product_id',
      label: t('orderItems.product'),
      type: 'select',
      options: products.map((p) => ({ value: p.id, label: p.name })),
      required: true,
    },
    {
      name: 'quantity',
      label: t('orderItems.quantity'),
      type: 'number',
      required: true,
      min: 1,
      step: 1,
    },
    {
      name: 'unit_price',
      label: t('orderItems.unitPrice'),
      type: 'number',
      required: true,
      min: 0.01,
      step: 0.01,
    },
  ];

  const handleSubmit = async (data: Partial<OrderItem>) => {
    if (orderId) {
      data.order_id = orderId;
    }
    if (!data.product_id || !data.order_id) {
      throw new Error(t('errors.requiredFieldsMissing'));
    }
    const processedData = {
      product_id: data.product_id,
      order_id: data.order_id,
      quantity: Number(data.quantity),
      unit_price: Number(data.unit_price),
    };

    await formHandler.handleSubmit(processedData);
    editModal.onClose();
  };

  return (
    <Layout>
      <Box mb={4}>
        <Button onClick={() => navigate(-1)} variant="outline">
          <LuArrowLeft />
          {t('common.back')}
        </Button>
        {orderId && (
          <Text fontSize="xl" mt={2}>
            {t('orderItems.forOrder')} #{orderId.slice(0, 8)}
          </Text>
        )}
      </Box>

      <GenericTable<OrderItem>
        title={orderId ? t('orderItems.titleForOrder') : t('orderItems.title')}
        items={orderItems}
        columns={columns}
        totalItems={orderItems.length}
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
        title={modalNav.selectedEntity ? t('orderItems.edit') : t('orderItems.create')}
        fields={orderItemFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={`${t('orderItems.item')} #${modalNav.selectedEntity?.id.slice(0, 8)}`}
      >
        <GenericDetailView
          items={[
            {
              label: 'orderItems.order',
              value: orders.find((o) => o.id === modalNav.selectedEntity?.order_id)?.id as
                | string
                | undefined,
              hidden: !!orderId,
              format: (value) => `Order #${String(value).slice(0, 8)}`,
            },
            {
              label: 'orderItems.product',
              value: products.find((p) => p.id === modalNav.selectedEntity?.product_id)?.name,
            },
            {
              label: 'orderItems.quantity',
              value: modalNav.selectedEntity?.quantity,
            },
            {
              label: 'orderItems.unitPrice',
              value: modalNav.selectedEntity?.unit_price as number | undefined,
              format: (value) => `${Number(value).toFixed(2)} ${t('units.currency')}`,
            },
            {
              label: 'orderItems.total',
              value: modalNav.selectedEntity
                ? (modalNav.selectedEntity.quantity * modalNav.selectedEntity.unit_price).toFixed(2)
                : '0.00',
              format: (value) => `$${value}`,
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default OrderItemsPage;
