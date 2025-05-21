import { Box, Button, Stack, Text, useDisclosure } from '@chakra-ui/react';
import DetailModal from '../components/DetailModal';
import Layout from '../components/Layout';
import { useCallback, useState } from 'react';
import { StorageZone } from '../api';
import { Warehouse } from '../api/entity/warehouse';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ui/toaster';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { FormField, GenericFormModal } from '../components/GenericModal';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import { LuArrowLeft } from 'react-icons/lu';
import {
  createStorageZone,
  deleteStorageZone,
  getAllStorageZones,
  getStorageZonesByWarehouse,
  updateStorageZone,
} from '../api/storageZone';
import { getWarehouses } from '../api/warehouses';

const PAGE_SIZE = 5;

const StorageZonesPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { warehouse_id } = useParams<{ warehouse_id?: string }>();
  const [storageZones, setStorageZones] = useState<StorageZone[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedZone, setSelectedZone] = useState<StorageZone | undefined>();
  const {
    open: openEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();
  const {
    open: openDetailModal,
    onOpen: onOpenDetailModal,
    onClose: onCloseDetailModal,
  } = useDisclosure();

  const columns: ColumnConfig<StorageZone>[] = [
    {
      header: t('storageZones.locationCode'),
      accessor: 'location_code',
      width: '200px',
    },
    {
      header: t('storageZones.warehouse'),
      accessor: (item) => {
        const warehouse = warehouses.find((w) => w.id === item.warehouse_id);
        return warehouse?.name || t('common.unknown');
      },
    },
    {
      header: t('storageZones.maxWeight'),
      accessor: 'max_weight',
      align: 'center',
    },
  ];

  const storageZoneFields: FormField<StorageZone>[] = [
    ...(!warehouse_id
      ? [
          {
            name: 'warehouse_id' as keyof StorageZone,
            label: t('storageZones.warehouse'),
            type: 'select' as const,
            options: warehouses.map((w) => ({
              value: w.id,
              label: w.name,
            })),
            required: true,
          },
        ]
      : []),
    {
      name: 'location_code',
      label: t('storageZones.locationCode'),
      type: 'text',
      required: true,
      placeholder: 'A-01',
    },
    {
      name: 'max_weight',
      label: t('storageZones.maxWeight'),
      type: 'number',
      required: true,
      min: 0,
      step: 0.1,
      placeholder: t('storageZones.maxWeightPlaceholder'),
    },
  ];

  const fetchStorageZones = useCallback(async () => {
    try {
      setLoading(true);
      const response = warehouse_id
        ? await getStorageZonesByWarehouse(warehouse_id)
        : await getAllStorageZones();

      if (Array.isArray(response)) {
        setStorageZones(response);
        setTotalItems(response.length);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [warehouse_id, t, toast]);

  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await getWarehouses();
      if (Array.isArray(response)) {
        setWarehouses(response);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    }
  }, [t, toast]);

  const handleSubmit = async (data: StorageZone | any) => {
    setLoading(true);
    try {
      let selectedWarehouse = null;
      if (typeof data.warehouse_id === 'string') {
        selectedWarehouse = warehouses.find((c) => c.id === data.warehouse_id);
      } else {
        selectedWarehouse = warehouses.find((c) => c.id === data.warehouse_id.value[0]);
      }
      const zoneData = {
        ...data,
        warehouse: selectedWarehouse,
        warehouse_id: warehouse_id || selectedWarehouse?.id,
      };

      if (selectedZone) {
        await updateStorageZone(selectedZone.id, zoneData);
      } else {
        await createStorageZone(zoneData);
      }
      await fetchStorageZones();
      onCloseEditModal();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.submitFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedZone(undefined);
    onOpenEditModal();
  };

  const handleEdit = (zone: StorageZone) => {
    setSelectedZone(zone);
    onOpenEditModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStorageZone(id);
      await fetchStorageZones();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map(deleteStorageZone));
      await fetchStorageZones();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handleDetail = (zone: StorageZone) => {
    setSelectedZone(zone);
    onOpenDetailModal();
  };

  useVisibilityPolling(fetchStorageZones, 60000);
  useVisibilityPolling(fetchWarehouses, 60000);

  return (
    <Layout>
      <Box mb={4}>
        <Button onClick={() => navigate(-1)} variant="outline">
          <LuArrowLeft />
          {t('common.back')}
        </Button>
      </Box>

      <GenericTable<StorageZone>
        title={t('storageZones.title')}
        items={storageZones}
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
        onView={handleDetail}
      />

      <GenericFormModal
        isOpen={openEditModal}
        onClose={onCloseEditModal}
        initialValues={selectedZone}
        title={selectedZone ? t('storageZones.edit') : t('storageZones.create')}
        fields={storageZoneFields}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitText={selectedZone ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={openDetailModal}
        onClose={onCloseDetailModal}
        title={selectedZone?.location_code || ''}
      >
        <Stack gap={3}>
          <Box>
            <Text fontWeight="semibold">{t('storageZones.warehouse')}:</Text>
            <Text>{warehouses.find((w) => w.id === selectedZone?.warehouse_id)?.name || '-'}</Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('storageZones.maxWeight')}:</Text>
            <Text>{selectedZone?.max_weight ? `${selectedZone.max_weight} кг` : '-'}</Text>
          </Box>
        </Stack>
      </DetailModal>
    </Layout>
  );
};

export default StorageZonesPage;
