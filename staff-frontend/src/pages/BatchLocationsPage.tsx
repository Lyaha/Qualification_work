import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ui/toaster';
import { useParams } from 'react-router-dom';
import { useCallback, useState } from 'react';
import {
  Batch,
  BatchLocation,
  Box as BoxType,
  createLocationBatches,
  deleteLocationBatches,
  getAllBatches,
  getAllLocationBatches,
  getByBatchId,
  StorageZone,
  updateLocationBatches,
} from '../api';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { FormField, GenericFormModal } from '../components/GenericModal';
import { Box, Text, Stack, useDisclosure } from '@chakra-ui/react';
import { getAllStorageZone } from '../api/storageZone';
import { createBox, getAllBox } from '../api/box';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import Layout from '../components/Layout';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const BatchLocationsPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { batchId } = useParams<{ batchId: string }>();
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [locations, setLocations] = useState<BatchLocation[]>([]);
  const [storageZones, setStorageZones] = useState<StorageZone[]>([]);
  const [boxes, setBoxes] = useState<BoxType[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<BatchLocation | undefined>();
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

  const columns: ColumnConfig<BatchLocation>[] = [
    {
      header: t('batchLocations.id'),
      accessor: 'id',
      width: '200px',
    },
    {
      header: t('batchLocations.batch'),
      accessor: (item) => item.batch_id || t('common.unknown'),
    },
    {
      header: t('batchLocations.storageZone'),
      accessor: (item) => item.storage_zone?.location_code || t('common.notSpecified'),
    },
    {
      header: t('batchLocations.box'),
      accessor: (item) => item.box?.name || t('common.notSpecified'),
    },
    {
      header: t('batchLocations.quantity'),
      accessor: 'quantity',
      align: 'right',
    },
    {
      header: t('batchLocations.createdAt'),
      accessor: (item) =>
        item.created_at ? new Date(item.created_at).toLocaleDateString() : t('common.notSpecified'),
    },
  ];

  const locationFields: FormField<BatchLocation>[] = [
    ...(!batchId
      ? [
          {
            name: 'batch_id' as keyof BatchLocation,
            label: t('batchLocations.batchId'),
            type: 'select' as const,
            options: batches.map((b) => ({
              value: b.id,
              label: b.id,
            })),
            required: true,
          },
        ]
      : []),
    {
      name: 'storage_zone_id' as keyof BatchLocation,
      label: t('batchLocations.storageZone'),
      type: 'select' as const,
      options: storageZones.map((sz) => ({
        value: sz.id,
        label: sz.location_code,
      })),
      required: true,
    },
    {
      name: 'box_id' as keyof BatchLocation,
      label: t('batchLocations.box'),
      type: 'select' as const,
      options: boxes.map((b) => ({
        value: b.id,
        label: b.name,
      })),
      required: true,
      onCreateNew: async (name) => {
        const data = {
          name: name.name,
          length: 1,
          width: 2,
          height: 3,
          max_weight: 4,
        };
        const newBox = await createBox(data);
        fetchBoxes();
        return { value: newBox.id, label: newBox.name };
      },
      fastCreatePlaceholder: t('boxes.createPlaceholder'),
    },
    {
      name: 'quantity' as keyof BatchLocation,
      label: t('batchLocations.quantity'),
      type: 'number' as const,
      required: true,
      min: 1,
    },
  ];

  const fetchLocations = useCallback(async () => {
    try {
      setLoading(true);
      const response = batchId ? await getByBatchId(batchId) : await getAllLocationBatches();
      if (!batchId) {
        fetchBatches();
      }
      setLocations(response);
      setTotalItems(response.length);
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [batchId, t, toast]);

  const fetchStorageZones = useCallback(async () => {
    try {
      const response = await getAllStorageZone();
      setStorageZones(response);
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    }
  }, [t, toast]);

  const fetchBoxes = useCallback(async () => {
    try {
      const response = await getAllBox();
      setBoxes(response);
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    }
  }, [t, toast]);

  const fetchBatches = useCallback(async () => {
    try {
      const response = await getAllBatches();
      setBatches(response);
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    }
  }, [t, toast]);

  const handleSubmit = async (data: BatchLocation) => {
    setLoading(true);
    try {
      const locationData = {
        batch_id: batchId || data.batch_id!,
        storage_zone_id: data.storage_zone_id,
        box_id: data.box_id,
        quantity: data.quantity,
      };

      if (!!locationData.storage_zone_id !== !!locationData.box_id) {
        throw new Error(t('errors.invalidLocationCombination'));
      }

      if (selectedLocation) {
        await updateLocationBatches(selectedLocation.id, locationData);
      } else {
        await createLocationBatches(locationData);
      }

      await fetchLocations();
      onCloseEditModal();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.submitFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteLocationBatches(id)));
      fetchLocations();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handleAdd = () => {
    setSelectedLocation(undefined);
    onOpenEditModal();
  };

  const handleEdit = (location: BatchLocation) => {
    setSelectedLocation(location);
    onOpenEditModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLocationBatches(id);
      fetchLocations();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handleDetail = (location: BatchLocation) => {
    setSelectedLocation(location);
    onOpenDetailModal();
  };

  useVisibilityPolling(fetchLocations, 60000);
  useVisibilityPolling(fetchStorageZones, 60000);
  useVisibilityPolling(fetchBoxes, 60000);

  return (
    <Layout>
      <GenericTable<BatchLocation>
        title={t('batchLocations.title')}
        items={locations}
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
        initialValues={selectedLocation}
        title={selectedLocation ? t('common.edit') : t('common.create')}
        fields={locationFields}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitText={selectedLocation ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={openDetailModal}
        onClose={onCloseDetailModal}
        title={t('batchLocations.details')}
      >
        <Stack gap={3}>
          {selectedLocation?.quantity != null && (
            <Box>
              <Text fontWeight="semibold">{t('batchLocations.quantity')}:</Text>
              <Text>{selectedLocation.quantity}</Text>
            </Box>
          )}

          <Box>
            <Text fontWeight="semibold">{t('batchLocations.storageZone')}:</Text>
            <Text>{selectedLocation?.storage_zone?.location_code || '-'}</Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('batchLocations.box')}:</Text>
            <Text>{selectedLocation?.box?.name || '-'}</Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('batchLocations.createdAt')}:</Text>
            <Text>
              {selectedLocation?.created_at
                ? new Date(selectedLocation.created_at).toLocaleString('uk-UA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </Text>
          </Box>
        </Stack>
      </DetailModal>
    </Layout>
  );
};

export default BatchLocationsPage;
