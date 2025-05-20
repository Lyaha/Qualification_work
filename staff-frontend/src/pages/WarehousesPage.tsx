import { useTranslation } from 'react-i18next';
import { useToast } from '../components/ui/toaster';
import { useCallback, useState } from 'react';
import { Box, Stack, useDisclosure, Text, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Warehouse } from '../api/entity/warehouse';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { FormField, GenericFormModal } from '../components/GenericModal';
import {
  createWarehouses,
  deleteWarehouses,
  getWarehouses,
  updateWarehouses,
} from '../api/warehouses';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import Layout from '../components/Layout';
import DetailModal from '../components/DetailModal';
import { getManagers, User } from '../api';

const PAGE_SIZE = 5;

const WarehousesPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [managers, setManagers] = useState<User[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | undefined>();
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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const columns: ColumnConfig<Warehouse>[] = [
    { header: t('warehouses.name'), accessor: 'name' },
    { header: t('warehouses.location'), accessor: 'location' },
    {
      header: t('warehouses.status'),
      accessor: (item) => (item.is_active ? t('warehouses.active') : t('warehouses.inactive')),
    },
    {
      header: t('warehouses.manager'),
      accessor: (item) =>
        item.manager ? `${item.manager.first_name} ${item.manager.last_name}` : t('common.unknown'),
    },
    { header: t('warehouses.workingHours'), accessor: 'working_hours' },
  ];

  const warehouseFields: FormField<Warehouse>[] = [
    {
      name: 'name',
      label: t('warehouses.name'),
      type: 'text',
      required: true,
      placeholder: t('warehouses.namePlaceholder'),
    },
    {
      name: 'location',
      label: t('warehouses.location'),
      type: 'text',
      required: true,
      placeholder: t('warehouses.locationPlaceholder'),
    },
    {
      name: 'working_hours',
      label: t('warehouses.workingHours'),
      type: 'text',
      placeholder: t('warehouses.workingHoursPlaceholder'),
    },
    {
      name: 'manager',
      label: t('batches.warehouse'),
      type: 'select',
      options: managers.map((w) => ({
        value: w.id,
        label: w.first_name + ' ' + w.last_name,
      })),
      required: true,
    },
    {
      name: 'is_active',
      label: t('warehouses.status'),
      type: 'checkbox',
      checkedLabel: t('warehouses.active'),
      uncheckedLabel: t('warehouses.inactive'),
    },
  ];

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      let selectedManager = null;
      if (typeof data.manager === 'string') {
        selectedManager = managers.find((c) => c.id === data.manager);
      } else {
        selectedManager = managers.find((c) => c.id === data.manager.value[0]);
      }
      if (!selectedWarehouse) {
        throw new Error(t('errors.managerRequired'));
      }
      const warehouseData = {
        name: data.name,
        location: data.location,
        working_hours: data.working_hours,
        manager_id: selectedManager?.id,
        is_active: data.is_active,
      };
      console.log(warehouseData);
      if (selectedWarehouse) {
        await updateWarehouses(selectedWarehouse.id, warehouseData);
      } else {
        await createWarehouses(warehouseData);
      }
      await fetchWarehouses();
      onCloseEditModal();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.submitFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = useCallback(async () => {
    try {
      const response = await getWarehouses();
      if (response && Array.isArray(response)) {
        setWarehouses(response);
        setTotalItems(response.length);
      } else {
        console.error('Invalid API response format:', response);
        setWarehouses([]);
        setTotalItems(0);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    }
  }, [t, toast]);

  const fetchManagers = useCallback(async () => {
    try {
      const response = await getManagers();
      if (response && Array.isArray(response)) {
        setManagers(response);
      } else {
        console.error('Invalid API response format:', response);
        setManagers([]);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    }
  }, [t, toast]);

  const handleAdd = () => {
    setSelectedWarehouse(undefined);
    onOpenEditModal();
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    onOpenEditModal();
  };

  const handleDetail = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    onOpenDetailModal();
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWarehouses(id);
      await fetchWarehouses();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteWarehouses(id)));
      await fetchWarehouses();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handelNavigate = () => {
    if (selectedWarehouse) {
      navigate(`/storage-zone/${selectedWarehouse.id}`);
    }
  };

  useVisibilityPolling(fetchWarehouses, 60000);
  useVisibilityPolling(fetchManagers, 60000);

  return (
    <Layout>
      <GenericTable<Warehouse>
        title={t('warehouses.title')}
        items={warehouses}
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
        initialValues={selectedWarehouse}
        title={selectedWarehouse ? t('warehouses.edit') : t('warehouses.create')}
        fields={warehouseFields}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitText={selectedWarehouse ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={openDetailModal}
        onClose={onCloseDetailModal}
        title={selectedWarehouse?.name || ''}
        additionalButton={<Button onClick={handelNavigate}>{t('warehouses.storageZone')}</Button>}
      >
        <Stack gap={3}>
          <Box>
            <Text fontWeight="semibold">{t('warehouses.location')}:</Text>
            <Text>{selectedWarehouse?.location || '-'}</Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('warehouses.workingHours')}:</Text>
            <Text>{selectedWarehouse?.working_hours || '-'}</Text>
          </Box>
          <Box>
            <Text fontWeight="semibold">{t('warehouses.manger')}:</Text>
            <Text>
              {selectedWarehouse?.manager
                ? `${selectedWarehouse.manager.first_name} ${selectedWarehouse.manager.last_name}`
                : t('common.unknown')}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('warehouses.status')}:</Text>
            <Text>
              {selectedWarehouse?.is_active ? t('warehouses.active') : t('warehouses.inactive')}
            </Text>
          </Box>
        </Stack>
      </DetailModal>
    </Layout>
  );
};

export default WarehousesPage;
