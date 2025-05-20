import { useTranslation } from 'react-i18next';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Batch, Product } from '../api';
import { createBatch, getAllBatches, getBatchesByProduct, updateBatch } from '../api/batches';
import Layout from '../components/Layout';
import { Box, Text, Stack, Button, useDisclosure } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate } from 'react-router-dom';
import { FormField, GenericFormModal } from '../components/GenericModal';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import { Warehouse } from '../api/entity/warehouse';
import { createWarehouses, getWarehouses } from '../api/warehouses';
import DetailModal from '../components/DetailModal';
import { createProduct, getProducts } from '../api/products';
import useCrudOperations from '../hooks/useUnivarsalCRUD';
import useModalNavigation from '../hooks/useModalNavigation';
import useFetchData from '../hooks/useUniversalFetchData';
import useFormHandler from '../hooks/useFormHandler';
import { GenericDetailView } from '../components/GenericDetailView';

const PAGE_SIZE = 5;

const BatchesPage = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const {
    data: batches,
    loading,
    refetch: fetchBatches,
  } = useFetchData<Batch>(productId ? getBatchesByProduct : getAllBatches, productId);
  const { data: warehouses, refetch: fetchWarehouses } = useFetchData<Warehouse>(getWarehouses);
  const { data: products, refetch: fetchProducts } = useFetchData<Product>(getProducts);

  const columns: ColumnConfig<Batch>[] = [
    {
      header: t('batches.batchNumber'),
      accessor: 'id',
      width: '200px',
    },
    {
      header: t('batches.product'),
      accessor: (item) => item.product?.name || t('common.unknown'),
    },
    {
      header: t('batches.warehouse'),
      accessor: (item) => {
        const warehouse = warehouses.find((w) => w.id === item.warehouse_id);
        return warehouse?.name || t('common.unknown');
      },
    },
    {
      header: t('batches.quantity'),
      accessor: 'quantity',
      align: 'right',
    },
    {
      header: t('batches.expirationDate'),
      accessor: (item) =>
        item.expiration_date
          ? new Date(item.expiration_date).toLocaleDateString()
          : t('common.notSpecified'),
    },
  ];

  const batchFields: FormField<Batch>[] = [
    ...(!productId
      ? [
          {
            name: 'product_id' as keyof Batch,
            label: t('batches.productId'),
            type: 'select' as const,
            options: products.map((p) => ({
              value: p.id,
              label: p.name,
            })),
            required: true,
            onCreateNew: async (name: any) => {
              const cat = products[products.length - 1]?.category_entity;
              const data = {
                name: name.name,
                description: 'Fast create',
                category_id: cat,
                category: cat.name,
                price_purchase: 100,
                price: 99,
                weight: 1,
              };
              const newProduct = await createProduct(data);
              fetchProducts();
              return { value: newProduct.id, label: newProduct.name };
            },
            fastCreatePlaceholder: t('products.createPlaceholder'),
          },
        ]
      : []),
    {
      name: 'warehouse_id',
      label: t('batches.warehouse'),
      type: 'select',
      options: warehouses.map((w) => ({
        value: w.id,
        label: w.name,
      })),
      required: true,
      onCreateNew: async (name) => {
        const data: any = {
          name: name.name,
          location: 'Fast create',
          working_hours: '06:00 - 23:00',
          is_active: true,
        };
        const newWarehouse = await createWarehouses(data);
        fetchWarehouses();
        return { value: newWarehouse.id, label: newWarehouse.name };
      },
      fastCreatePlaceholder: t('warehouses.createPlaceholder'),
    },
    {
      name: 'expiration_date',
      label: t('batches.expirationDate'),
      type: 'date',
      placeholder: 'YYYY-MM-DD',
    },
    {
      name: 'quantity',
      label: t('batches.quantity'),
      type: 'number',
      required: true,
      min: 1,
    },
  ];

  const handleSubmit = async (data: any) => {
    let selectedWarehouse = null;
    if (typeof data.warehouse_id === 'string') {
      selectedWarehouse = warehouses.find((c) => c.id === data.warehouse_id);
    } else {
      selectedWarehouse = warehouses.find((c) => c.id === data.warehouse_id.value[0]);
    }
    if (!selectedWarehouse) {
      throw new Error(t('errors.warehouseRequired'));
    }
    let batchData = null;
    if (productId) {
      batchData = {
        product_id: productId,
        quantity: data.quantity,
        expiration_date: data.expiration_date,
        warehouse_id: selectedWarehouse.id,
      };
    } else {
      let selectedProduct = null;
      if (typeof data.product_id === 'string') {
        selectedProduct = products.find((c) => c.id === data.product_id);
      } else {
        selectedProduct = products.find((c) => c.id === data.product_id.value[0]);
      }
      if (!selectedProduct) {
        throw new Error(t('errors.productRequired'));
      }
      batchData = {
        product_id: selectedProduct.id,
        quantity: data.quantity,
        expiration_date: data.expiration_date,
        warehouse_id: selectedWarehouse.id,
      };
    }
    await formHandler.handleSubmit(batchData);

    editModal.onClose();
  };

  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Универсальные хуки

  const modalNav = useModalNavigation<Batch>(navigate, detailModal.onOpen, editModal.onOpen);

  // Загрузка данных

  const { handleDelete, handleBulkDelete } = useCrudOperations<Batch>(fetchBatches, '/batch');

  // Форма
  const formHandler = useFormHandler<Batch>(
    modalNav.selectedEntity,
    fetchBatches,
    createBatch,
    updateBatch,
  );

  const handleNavigateToLocations = () => {
    if (modalNav.selectedEntity) {
      navigate(`/batch-location/${modalNav.selectedEntity.id}`);
    }
  };

  useVisibilityPolling(fetchBatches, 60000);
  useVisibilityPolling(fetchWarehouses, 60000);

  return (
    <Layout>
      <Box mb={4}>
        <Button onClick={() => navigate(-1)} variant="outline">
          {<LuArrowLeft />}
          {t('common.back')}
        </Button>
      </Box>

      <GenericTable<Batch>
        title={t('batches.title')}
        items={batches}
        columns={columns}
        totalItems={batches.length}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
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
        title={modalNav.selectedEntity ? t('batches.edit') : t('batches.create')}
        fields={batchFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={modalNav.selectedEntity?.id || ''}
        additionalButton={
          <Button onClick={handleNavigateToLocations}>{t('batches.location')}</Button>
        }
      >
        <GenericDetailView
          items={[
            {
              label: 'batches.product',
              value: modalNav.selectedEntity?.product?.name,
              hideIfEmpty: true,
            },
            {
              label: 'batches.quantity',
              value: modalNav.selectedEntity?.quantity.toString(),
              hideIfEmpty: true,
            },
            {
              label: 'batches.expirationDate',
              value: modalNav.selectedEntity?.expiration_date
                ? new Date(modalNav.selectedEntity.expiration_date)
                : null, // Date | null
              format: (data) => (data ? data.toLocaleString('uk-UA') : '-'),
            },
            {
              label: 'batches.receivedAt',
              value: modalNav.selectedEntity?.received_at
                ? new Date(modalNav.selectedEntity.received_at)
                : null,
            },
            {
              label: 'batches.warehouseName',
              value:
                warehouses.find((w) => w.id === modalNav.selectedEntity?.warehouse_id)?.name || '-',
            },
            {
              label: 'batches.warehouseLocation',
              value:
                warehouses.find((w) => w.id === modalNav.selectedEntity?.warehouse_id)?.location ||
                '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default BatchesPage;
