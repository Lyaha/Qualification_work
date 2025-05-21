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
  UserWarehouse,
  createUserWarehouse,
  getAllUserWarehouses,
  updateUserWarehouse,
  User,
  getUsers,
  Warehouse,
  getWarehouses,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const UserWarehousesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  const {
    data: userWarehouses,
    loading,
    refetch: fetchUserWarehouses,
  } = useFetchData<UserWarehouse>(getAllUserWarehouses);
  const { data: users } = useFetchData<User>(getUsers);
  const { data: warehouses } = useFetchData<Warehouse>(getWarehouses);

  const { handleDelete, handleBulkDelete } = useCrudOperations<UserWarehouse>(
    fetchUserWarehouses,
    '/user-warehouse',
  );
  const modalNav = useModalNavigation<UserWarehouse>(
    navigate,
    detailModal.onOpen,
    editModal.onOpen,
  );
  const formHandler = useFormHandler<UserWarehouse>(
    modalNav.selectedEntity,
    fetchUserWarehouses,
    createUserWarehouse,
    updateUserWarehouse,
  );

  const columns: ColumnConfig<UserWarehouse>[] = [
    {
      header: t('userWarehouses.user'),
      accessor: (item) => users.find((u) => u.id === item.user_id)?.email || t('common.unknown'),
    },
    {
      header: t('userWarehouses.warehouse'),
      accessor: (item) =>
        warehouses.find((w) => w.id === item.warehouse_id)?.name || t('common.unknown'),
    },
    {
      header: t('userWarehouses.assignedAt'),
      accessor: 'assigned_at',
      format: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const userWarehouseFields: FormField<UserWarehouse>[] = [
    {
      name: 'user_id',
      label: t('userWarehouses.user'),
      type: 'select',
      options: users.map((u) => ({ value: u.id, label: u.email })),
      required: true,
    },
    {
      name: 'warehouse_id',
      label: t('userWarehouses.warehouse'),
      type: 'select',
      options: warehouses.map((w) => ({ value: w.id, label: w.name })),
      required: true,
    },
  ];

  const handleSubmit = async (data: Partial<UserWarehouse>) => {
    if (!data.user_id || !data.warehouse_id) {
      throw new Error(t('error.fieldsRequired'));
    }

    await formHandler.handleSubmit({
      user_id: data.user_id,
      warehouse_id: data.warehouse_id,
      assigned_at: data.assigned_at || new Date(),
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

      <GenericTable<UserWarehouse>
        title={t('userWarehouses.title')}
        items={userWarehouses}
        columns={columns}
        totalItems={userWarehouses.length}
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
        title={modalNav.selectedEntity ? t('userWarehouses.edit') : t('userWarehouses.create')}
        fields={userWarehouseFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={`${t('userWarehouses.assignment')} #${modalNav.selectedEntity?.id.slice(0, 8)}`}
      >
        <GenericDetailView
          items={[
            {
              label: 'userWarehouses.user',
              value: users.find((u) => u.id === modalNav.selectedEntity?.user_id)?.email,
            },
            {
              label: 'userWarehouses.warehouse',
              value: warehouses.find((w) => w.id === modalNav.selectedEntity?.warehouse_id)?.name,
            },
            {
              label: 'userWarehouses.assignedAt',
              value: modalNav.selectedEntity?.assigned_at
                ? new Date(modalNav.selectedEntity.assigned_at)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default UserWarehousesPage;
