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
  SupplyOrder,
  createSupplyOrder,
  getAllSupplyOrders,
  updateSupplyOrder,
  Supplier,
  getAllSuppliers,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const SupplyOrdersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const {
    data: supplyOrders,
    loading,
    refetch: fetchSupplyOrders,
  } = useFetchData<SupplyOrder>(getAllSupplyOrders);
  const { data: suppliers } = useFetchData<Supplier>(getAllSuppliers);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<SupplyOrder>(
    fetchSupplyOrders,
    '/supply-order',
  );
  const modalNav = useModalNavigation<SupplyOrder>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<SupplyOrder>(
    modalNav.selectedEntity,
    fetchSupplyOrders,
    createSupplyOrder,
    updateSupplyOrder,
  );

  const columns: ColumnConfig<SupplyOrder>[] = [
    {
      header: t('supplyOrders.supplier'),
      accessor: (item) =>
        suppliers.find((s) => s.id === item.supplier_id)?.name || t('common.unknown'),
    },
    {
      header: t('supplyOrders.status'),
      accessor: 'status',
      format: (value) => t(`supplyOrders.statuses.${value}`),
    },
    {
      header: t('supplyOrders.expectedDelivery'),
      accessor: 'expected_delivery_date',
      format: (date) => new Date(date).toLocaleDateString(),
    },
    {
      header: t('supplyOrders.createdAt'),
      accessor: 'created_at',
      format: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const supplyOrderFields: FormField<SupplyOrder>[] = [
    {
      name: 'supplier_id',
      label: t('supplyOrders.supplier'),
      type: 'select',
      options: suppliers.map((s) => ({ value: s.id, label: s.name })),
      required: true,
    },
    {
      name: 'expected_delivery_date',
      label: t('supplyOrders.expectedDelivery'),
      type: 'date',
      required: true,
    },
    {
      name: 'status',
      label: t('supplyOrders.status'),
      type: 'select',
      options: [
        { value: 'draft', label: t('supplyOrders.statuses.draft') },
        { value: 'confirmed', label: t('supplyOrders.statuses.confirmed') },
        { value: 'delivered', label: t('supplyOrders.statuses.delivered') },
        { value: 'completed', label: t('supplyOrders.statuses.completed') },
      ],
      required: true,
    },
  ];

  const handleSubmit = async (data: Partial<SupplyOrder>) => {
    if (!data.supplier_id) {
      throw new Error(t('errors.supplierIdRequired'));
    }
    if (!data.status) {
      throw new Error(t('errors.statusRequired'));
    }

    if (!data.expected_delivery_date) {
      throw new Error(t('errors.expectedDeliveryDateRequired'));
    }

    await formHandler.handleSubmit({
      supplier_id: data.supplier_id,
      status: data.status,
      created_at: data.created_at ?? new Date().toLocaleDateString(),
      expected_delivery_date: new Date(data.expected_delivery_date).toISOString(),
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

      <GenericTable<SupplyOrder>
        title={t('supplyOrders.title')}
        items={supplyOrders}
        columns={columns}
        totalItems={supplyOrders.length}
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
        title={modalNav.selectedEntity ? t('supplyOrders.edit') : t('supplyOrders.create')}
        fields={supplyOrderFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={`${t('supplyOrders.order')} #${modalNav.selectedEntity?.id.slice(0, 8)}`}
      >
        <GenericDetailView
          items={[
            {
              label: 'supplyOrders.supplier',
              value: suppliers.find((s) => s.id === modalNav.selectedEntity?.supplier_id)?.name,
            },
            {
              label: 'supplyOrders.status',
              value: modalNav.selectedEntity?.status,
              format: (value) => t(`supplyOrders.statuses.${value}`),
            },
            {
              label: 'supplyOrders.expectedDelivery',
              value: modalNav.selectedEntity?.expected_delivery_date
                ? new Date(modalNav.selectedEntity.expected_delivery_date)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
            {
              label: 'supplyOrders.createdAt',
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

export default SupplyOrdersPage;
