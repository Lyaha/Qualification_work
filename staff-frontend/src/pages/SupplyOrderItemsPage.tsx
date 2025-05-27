import { useTranslation } from 'react-i18next';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { useState } from 'react';
import Layout from '../components/Layout';
import { Box, Button, useDisclosure, Text } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import { FormField, GenericFormModal } from '../components/GenericModal';
import { GenericDetailView } from '../components/GenericDetailView';
import useCrudOperations from '../hooks/useUnivarsalCRUD';
import useModalNavigation from '../hooks/useModalNavigation';
import useFetchData from '../hooks/useUniversalFetchData';
import useFormHandler from '../hooks/useFormHandler';
import {
  SupplyOrderItem,
  createSupplyOrderItem,
  deleteSupplyOrderItem,
  getAllSupplyOrderItems,
  updateSupplyOrderItem,
  SupplyOrder,
  Product,
  getAllSupplyOrders,
  getProducts,
  getSupplyOrderItemsBySupplyOrderId,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const SupplyOrderItemsPage = () => {
  const { t } = useTranslation();
  const { supplyOrderId } = useParams<{ supplyOrderId: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const {
    data: items,
    loading,
    refetch: fetchItems,
  } = useFetchData<SupplyOrderItem>(
    supplyOrderId
      ? () => getSupplyOrderItemsBySupplyOrderId(supplyOrderId)
      : getAllSupplyOrderItems,
  );
  const { data: supplyOrders } = useFetchData<SupplyOrder>(getAllSupplyOrders);
  const { data: products } = useFetchData<Product>(getProducts);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<SupplyOrderItem>(
    fetchItems,
    '/supply-order-item',
  );
  const modalNav = useModalNavigation<SupplyOrderItem>(
    navigate,
    detailModal.onOpen,
    editModal.onOpen,
  );
  const formHandler = useFormHandler<SupplyOrderItem>(
    modalNav.selectedEntity,
    fetchItems,
    createSupplyOrderItem,
    updateSupplyOrderItem,
  );

  const columns: ColumnConfig<SupplyOrderItem>[] = [
    {
      header: t('supplyOrderItems.supplyOrder'),
      accessor: (item) =>
        `SO-${supplyOrders.find((so) => so.id === item.supply_order_id)?.id.slice(0, 8)}`,
    },
    {
      header: t('supplyOrderItems.product'),
      accessor: (item) =>
        products.find((p) => p.id === item.product_id)?.name || t('common.unknown'),
    },
    {
      header: t('supplyOrderItems.quantity'),
      accessor: 'quantity',
      align: 'right',
    },
    {
      header: t('supplyOrderItems.unitPrice'),
      accessor: (item) => `${item.unit_price} ${t('units.currency')}`,
      align: 'right',
    },
    {
      header: t('supplyOrderItems.total'),
      accessor: (item) => `${item.quantity * item.unit_price} ${t('units.currency')}`,
      align: 'right',
    },
  ];

  const supplyOrderItemFields: FormField<SupplyOrderItem>[] = [
    {
      name: 'supply_order_id',
      label: t('supplyOrderItems.supplyOrder'),
      type: 'select',
      options: supplyOrders.map((so) => ({
        value: so.id,
        label: `SO-${so.id.slice(0, 8)}`,
      })),
      required: true,
    },
    {
      name: 'product_id',
      label: t('supplyOrderItems.product'),
      type: 'select',
      options: products.map((p) => ({ value: p.id, label: p.name })),
      required: true,
    },
    {
      name: 'quantity',
      label: t('supplyOrderItems.quantity'),
      type: 'number',
      required: true,
      min: 1,
      step: 1,
    },
    {
      name: 'unit_price',
      label: t('supplyOrderItems.unitPrice'),
      type: 'number',
      required: true,
      min: 0.01,
      step: 0.01,
    },
  ];

  const handleSubmit = async (data: Partial<SupplyOrderItem>) => {
    if (supplyOrderId !== undefined && !supplyOrderId) {
      data.supply_order_id = supplyOrderId;
    }

    if (!data.supply_order_id) {
      throw new Error(t('errors.supplyOrderIdRequired'));
    }
    if (!data.product_id) {
      throw new Error(t('errors.productRequired'));
    }
    const processedData = {
      product_id: data.product_id,
      supply_order_id: data.supply_order_id,
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
        {supplyOrderId && (
          <Text fontSize="xl" mt={2}>
            {t('supplyOrderItems.forSupplyOrder')} SO-{supplyOrderId.slice(0, 8)}
          </Text>
        )}
      </Box>

      <GenericTable<SupplyOrderItem>
        title={supplyOrderId ? t('supplyOrderItems.titleForOrder') : t('supplyOrderItems.title')}
        items={items}
        columns={columns}
        totalItems={items.length}
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
        title={modalNav.selectedEntity ? t('supplyOrderItems.edit') : t('supplyOrderItems.create')}
        fields={supplyOrderItemFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={`${t('supplyOrderItems.item')} #${modalNav.selectedEntity?.id.slice(0, 8)}`}
      >
        <GenericDetailView
          items={[
            {
              label: 'supplyOrderItems.supplyOrder',
              value: supplyOrders.find((so) => so.id === modalNav.selectedEntity?.supply_order_id)
                ?.id,
              hidden: !!supplyOrderId,
              format: (value) => `SO-${String(value).slice(0, 8)}`,
            },
            {
              label: 'supplyOrderItems.product',
              value: products.find((p) => p.id === modalNav.selectedEntity?.product_id)?.name,
            },
            {
              label: 'supplyOrderItems.quantity',
              value: modalNav.selectedEntity?.quantity,
            },
            {
              label: 'supplyOrderItems.unitPrice',
              value: modalNav.selectedEntity?.unit_price,
              format: (value) => `${Number(value).toFixed(2)} ${t('units.currency')}`,
            },
            {
              label: 'supplyOrderItems.total',
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

export default SupplyOrderItemsPage;
