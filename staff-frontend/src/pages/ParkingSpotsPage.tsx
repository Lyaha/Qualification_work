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
  createParkingSpot,
  getAllParkingSpots,
  updateParkingSpot,
  ParkingSpot,
  Warehouse,
  getWarehouses,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const ParkingSpotsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  const {
    data: parkingSpots,
    loading,
    refetch: fetchParkingSpots,
  } = useFetchData<ParkingSpot>(getAllParkingSpots);
  const { data: warehouses } = useFetchData<Warehouse>(getWarehouses);

  const { handleDelete, handleBulkDelete } = useCrudOperations<ParkingSpot>(
    fetchParkingSpots,
    '/parking-spots',
  );
  const modalNav = useModalNavigation<ParkingSpot>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<ParkingSpot>(
    modalNav.selectedEntity,
    fetchParkingSpots,
    createParkingSpot,
    updateParkingSpot,
  );

  const columns: ColumnConfig<ParkingSpot>[] = [
    {
      header: t('parkingSpots.id'),
      accessor: 'id',
      width: '200px',
    },
    {
      header: t('parkingSpots.warehouse'),
      accessor: (item) =>
        warehouses.find((w) => w.id === item.warehouse_id)?.name || t('common.unknown'),
    },
    {
      header: t('parkingSpots.status'),
      accessor: 'status',
      format: (value) => t(`parkingSpots.types.${value}`),
    },
    {
      header: t('parkingSpots.reservedUntil'),
      accessor: (item) =>
        item.reserved_until
          ? new Date(item.reserved_until).toISOString()
          : t('common.notSpecified'),
    },
    {
      header: t('parkingSpots.entityType'),
      accessor: 'entity_type',
    },
  ];

  const parkingSpotFields: FormField<ParkingSpot>[] = [
    {
      name: 'warehouse_id',
      label: t('parkingSpots.warehouse'),
      type: 'select',
      options: warehouses.map((w) => ({ value: w.id, label: w.name })),
      required: true,
    },
    {
      name: 'status',
      label: t('parkingSpots.status'),
      type: 'select',
      options: [
        { value: 'available', label: t('parkingSpots.types.available') },
        { value: 'reserved', label: t('parkingSpots.types.reserved') },
        { value: 'occupied', label: t('parkingSpots.types.occupied') },
      ],
      required: true,
    },
    {
      name: 'reserved_until',
      label: t('parkingSpots.reservedUntil'),
      type: 'date',
      required: (values) => values.status === 'reserved',
    },
    {
      name: 'entity_type',
      label: t('parkingSpots.entityType'),
      type: 'text',
    },
    {
      name: 'reference_id',
      label: t('parkingSpots.referenceId'),
      type: 'text',
    },
  ];

  const handleSubmit = async (data: any) => {
    let selectedStatus = null;
    if (typeof data.status === 'string') {
      selectedStatus = data.status;
    } else {
      selectedStatus = data.status.value[0];
    }
    let selectedReservedUntil = null;
    if (selectedReservedUntil === 'reserved') {
      selectedReservedUntil = data.reservedUntil;
    }
    await formHandler.handleSubmit({
      ...data,
      status: selectedStatus,
      reserved_until: selectedReservedUntil,
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

      <GenericTable<ParkingSpot>
        title={t('parkingSpots.title')}
        items={parkingSpots}
        columns={columns}
        totalItems={parkingSpots.length}
        onPageChange={setCurrentPage}
        currentPage={currentPage}
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
        title={modalNav.selectedEntity ? t('parkingSpots.edit') : t('parkingSpots.create')}
        fields={parkingSpotFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={modalNav.selectedEntity?.id || ''}
      >
        <GenericDetailView
          items={[
            {
              label: 'parkingSpots.warehouse',
              value: warehouses.find((w) => w.id === modalNav.selectedEntity?.warehouse_id)?.name,
            },
            {
              label: 'parkingSpots.status',
              value: modalNav.selectedEntity?.status,
              format: (value) => t(`parkingSpots.statuses.${value}`),
            },
            {
              label: 'parkingSpots.reservedUntil',
              value: modalNav.selectedEntity?.reserved_until
                ? new Date(modalNav.selectedEntity.reserved_until)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
            {
              label: 'parkingSpots.entityType',
              value: modalNav.selectedEntity?.entity_type || '-',
            },
            {
              label: 'parkingSpots.referenceId',
              value: modalNav.selectedEntity?.reference_id || '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default ParkingSpotsPage;
