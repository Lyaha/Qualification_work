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
  InventoryMovement,
  createMovement,
  getAllMovements,
  updateMovement,
  getAllStorageZones,
  getProducts,
  StorageZone,
  Product,
  User,
  getUsers,
  MovementType,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const MovementsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const {
    data: movements,
    loading,
    refetch: fetchMovements,
  } = useFetchData<InventoryMovement>(getAllMovements);
  const { data: zones } = useFetchData<StorageZone>(getAllStorageZones);
  const { data: products } = useFetchData<Product>(getProducts);
  const { data: users } = useFetchData<User>(getUsers);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<InventoryMovement>(
    fetchMovements,
    '/inventory-movement',
  );
  const modalNav = useModalNavigation<InventoryMovement>(
    navigate,
    editModal.onOpen,
    detailModal.onOpen,
  );
  const formHandler = useFormHandler<InventoryMovement>(
    modalNav.selectedEntity,
    fetchMovements,
    createMovement,
    updateMovement,
  );

  const columns: ColumnConfig<InventoryMovement>[] = [
    {
      header: t('movements.id'),
      accessor: 'id',
      width: '200px',
    },
    {
      header: t('movements.product'),
      accessor: (item) =>
        products.find((p) => p.id === item.product_id)?.name || t('common.unknown'),
    },
    {
      header: t('movements.type'),
      accessor: 'movement_type',
    },
    {
      header: t('movements.quantity'),
      accessor: 'quantity',
      align: 'right',
    },
    {
      header: t('movements.user'),
      accessor: (item) =>
        users.find((u) => u.id === item.user_id)
          ? `${users.find((u) => u.id === item.user_id)?.first_name} ${users.find((u) => u.id === item.user_id)?.last_name}`
          : t('common.unknown'),
    },
    {
      header: t('movements.fromZone'),
      accessor: (item) => zones.find((z) => z.id === item.from_zone_id)?.location_code || '-',
    },
    {
      header: t('movements.toZone'),
      accessor: (item) => zones.find((z) => z.id === item.to_zone_id)?.location_code || '-',
    },
    {
      header: t('movements.date'),
      accessor: (item) =>
        item.created_at ? new Date(item.created_at).toLocaleDateString() : t('common.notSpecified'),
    },
  ];

  const movementFields: FormField<InventoryMovement>[] = [
    {
      name: 'user_id',
      label: t('movements.responsible'),
      type: 'select',
      options: users.map((u) => ({ value: u.id, label: `${u.first_name} ${u.last_name}` })),
      required: true,
    },
    {
      name: 'product_id',
      label: t('movements.product'),
      type: 'select',
      options: products.map((p) => ({ value: p.id, label: p.name })),
      required: true,
    },
    {
      name: 'movement_type',
      label: t('movements.type'),
      type: 'select',
      options: [
        { value: 'incoming', label: t('movements.types.incoming') },
        { value: 'outgoing', label: t('movements.types.outgoing') },
        { value: 'transfer', label: t('movements.types.transfer') },
      ],
      required: true,
    },
    {
      name: 'from_zone_id',
      label: t('movements.fromZone'),
      type: 'select',
      options: zones.map((z) => ({ value: z.id, label: z.location_code })),
      required: (values: Partial<InventoryMovement>) =>
        values.movement_type === 'transfer' || values.movement_type === 'outgoing',
    },
    {
      name: 'to_zone_id',
      label: t('movements.toZone'),
      type: 'select',
      options: zones.map((z) => ({ value: z.id, label: z.location_code })),
      required: (values) =>
        values.movement_type === 'transfer' || values.movement_type === 'incoming',
    },
    {
      name: 'quantity',
      label: t('movements.quantity'),
      type: 'number',
      required: true,
      min: 1,
    },
    {
      name: 'note',
      label: t('movements.note'),
      type: 'textarea',
    },
  ];

  const handleSubmit = async (data: any) => {
    let selectedUser = null;
    if (typeof data.user_id === 'string') {
      selectedUser = users.find((u) => u.id === data.user_id);
    } else {
      selectedUser = users.find((u) => u.id === data.user_id.value[0]);
    }
    if (!selectedUser) {
      console.log('empty');
      throw new Error(t('errors.userRequired'));
    }

    let selectedProduct = null;
    if (typeof data.product_id === 'string') {
      selectedProduct = products.find((p) => p.id === data.product_id);
    } else {
      selectedProduct = products.find((p) => p.id === data.product_id.value[0]);
    }
    if (!selectedProduct) {
      console.log('empty');
      throw new Error(t('errors.productRequired'));
    }

    let selectedMovmentType = null;
    console.log(data.movement_type, '  ', typeof data.movement_type);
    if (typeof data.movement_type === 'string') {
      selectedMovmentType = data.movement_type;
    } else {
      selectedMovmentType = data.movement_type.value[0];
    }
    if (!selectedMovmentType) {
      console.log('empty');
      throw new Error(t('errors.movmentTypeRequired'));
    }

    let selectedToZoneId = null;
    if (typeof data.to_zone_id === 'string') {
      selectedToZoneId = zones.find((z) => z.id === data.to_zone_id);
    } else {
      selectedToZoneId = zones.find((z) => z.id === data.to_zone_id.value[0]);
    }
    if (!selectedToZoneId) {
      console.log('empty');
      throw new Error(t('errors.toZoneIdRequired'));
    }

    let selectedFromZoneId = null;
    if (typeof data.from_zone_id === 'string') {
      selectedFromZoneId = zones.find((z) => z.id === data.from_zone_id);
    } else {
      selectedFromZoneId = zones.find((z) => z.id === data.from_zone_id.value[0]);
    }
    if (!selectedFromZoneId) {
      console.log('empty');
      throw new Error(t('errors.fromZoneIdRequired'));
    }

    const batchData = {
      product_id: selectedProduct.id,
      from_zone_id: selectedFromZoneId.id,
      to_zone_id: selectedToZoneId.id,
      quantity: data.quantity,
      movement_type: selectedMovmentType as MovementType,
      user_id: selectedUser.id,
      created_at: new Date().toISOString(),
      note: data.note,
    };
    console.log(batchData);
    await formHandler.handleSubmit(batchData);
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

      <GenericTable<InventoryMovement>
        title={t('movements.title')}
        items={movements}
        columns={columns}
        totalItems={movements.length}
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
        title={modalNav.selectedEntity ? t('movements.edit') : t('movements.create')}
        fields={movementFields}
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
              label: 'movements.responsible',
              value: users.find((u) => u.id === modalNav.selectedEntity?.user_id)
                ? `${users.find((u) => u.id === modalNav.selectedEntity?.user_id)?.first_name} ${users.find((u) => u.id === modalNav.selectedEntity?.user_id)?.last_name}`
                : '-',
              hideIfEmpty: true,
            },
            {
              label: 'movements.product',
              value: products.find((p) => p.id === modalNav.selectedEntity?.product_id)?.name,
              hideIfEmpty: true,
            },
            {
              label: 'movements.type',
              value: modalNav.selectedEntity?.movement_type,
              format: (value) => t(`movements.types.${value}`),
            },
            {
              label: 'movements.quantity',
              value: modalNav.selectedEntity?.quantity,
            },
            {
              label: 'movements.fromZone',
              value:
                zones.find((z) => z.id === modalNav.selectedEntity?.from_zone_id)?.location_code ||
                '-',
            },
            {
              label: 'movements.toZone',
              value:
                zones.find((z) => z.id === modalNav.selectedEntity?.to_zone_id)?.location_code ||
                '-',
            },
            {
              label: 'movements.date',
              value: modalNav.selectedEntity?.created_at
                ? new Date(modalNav.selectedEntity.created_at)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
            {
              label: 'movements.note',
              value: modalNav.selectedEntity?.note || '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default MovementsPage;
