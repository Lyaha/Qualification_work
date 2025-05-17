import { useTranslation } from 'react-i18next';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { useToast } from '../components/ui/toaster';
import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Batch, get, getByBatchId, Product } from '../api';
import {
  createBatch,
  deleteBatches,
  getAllBatches,
  getBatchesByProduct,
  updateBatch,
} from '../api/batches';
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

const PAGE_SIZE = 5;

const BatchesPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { productId } = useParams<{ productId: string }>();
  const [batches, setBatches] = useState<Batch[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | undefined>();
  const {
    open: OpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();
  const {
    open: OpenDetailModal,
    onOpen: onOpenDetailModal,
    onClose: onCloseDetailModal,
  } = useDisclosure();

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
        fetchWarhouses();
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
    setLoading(true);
    try {
      let selectedWarehouse = null;
      console.log(data);
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
        batchData = {
          product_id: data.product_id,
          quantity: data.quantity,
          expiration_date: data.expiration_date,
          warehouse_id: selectedWarehouse.id,
        };
      }
      if (selectedBatch) {
        await updateBatch(selectedBatch.id, batchData);
      } else {
        await createBatch(batchData);
      }
      await fetchBatches();
      onCloseEditModal();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.submitFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchBatches = useCallback(async () => {
    try {
      setLoading(true);
      let response = null;
      if (productId) {
        response = await getBatchesByProduct(productId);
      } else {
        response = await getAllBatches();
      }
      if (response && Array.isArray(response)) {
        setBatches(response);
        setTotalItems(response.length);
      } else {
        console.error('Неверный формат ответа API:', response);
        setBatches([]);
        setTotalItems(0);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [productId, t, toast]);

  const fetchWarhouses = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getWarehouses();
      if (response && Array.isArray(response)) {
        setWarehouses(response);
      } else {
        console.error('Неверный формат ответа API:', response);
        setWarehouses([]);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProducts();
      if (response && Array.isArray(response)) {
        setProducts(response);
      } else {
        console.error('Неверный формат ответа API:', response);
        setProducts([]);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteBatches(id)));
      fetchBatches();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handleAdd = () => {
    setSelectedBatch(undefined);
    onOpenEditModal();
  };

  const handleEdit = (batches: Batch) => {
    setSelectedBatch(batches);
    onOpenEditModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBatches(id);
      fetchBatches();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handelDetail = (batch: Batch) => {
    setSelectedBatch(batch);
    onOpenDetailModal();
  };

  const handelNavigate = () => {
    if (productId) {
      navigate(`/batches/${productId}`);
    }
  };

  useVisibilityPolling(fetchBatches, 60000);
  useVisibilityPolling(fetchWarhouses, 60000);

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
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onAdd={handleAdd}
        onEdit={handleEdit}
        getId={(item) => item.id}
        isLoading={loading}
        isView={true}
        onView={handelDetail}
      />

      <GenericFormModal
        isOpen={OpenEditModal}
        onClose={onCloseEditModal}
        initialValues={selectedBatch}
        title={selectedBatch ? t('batches.edit') : t('batches.create')}
        fields={batchFields}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitText={selectedBatch ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={OpenDetailModal}
        onClose={onCloseDetailModal}
        title={selectedBatch?.id || ''}
        additionalButton={<Button onClick={handelNavigate}>{t('batches.location')}</Button>}
      >
        <Stack gap={3}>
          {selectedBatch?.product?.name && (
            <Box>
              <Text fontWeight="semibold">{t('batches.product')}:</Text>
              <Text>{selectedBatch.product.name}</Text>
            </Box>
          )}

          {selectedBatch?.quantity != null && (
            <Box>
              <Text fontWeight="semibold">{t('batches.quantity')}:</Text>
              <Text>{selectedBatch.quantity}</Text>
            </Box>
          )}

          <Box>
            <Text fontWeight="semibold">{t('batches.expirationDate')}:</Text>
            <Text>
              {selectedBatch?.expiration_date
                ? new Date(selectedBatch.expiration_date).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : '-'}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('batches.receivedAt')}:</Text>
            <Text>
              {selectedBatch?.received_at
                ? new Date(selectedBatch.received_at).toLocaleDateString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </Text>
          </Box>

          {warehouses && (
            <>
              <Box>
                <Text fontWeight="semibold">{t('batches.warehouseName')}:</Text>
                <Text>
                  {warehouses.find((c) => c.id === selectedBatch?.warehouse_id)?.name || '-'}
                </Text>
              </Box>

              <Box>
                <Text fontWeight="semibold">{t('batches.warehouseLocation')}:</Text>
                <Text>
                  {warehouses.find((c) => c.id === selectedBatch?.warehouse_id)?.location || '-'}
                </Text>
              </Box>
            </>
          )}
        </Stack>
      </DetailModal>
    </Layout>
  );
};

export default BatchesPage;
