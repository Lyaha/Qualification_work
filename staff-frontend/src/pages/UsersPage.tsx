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
import { User, createUser, getUsers, updateUser } from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const UsersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const { data: users, loading, refetch: fetchUsers } = useFetchData<User>(getUsers);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<User>(fetchUsers, '/users');
  const modalNav = useModalNavigation<User>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<User>(
    modalNav.selectedEntity,
    fetchUsers,
    createUser,
    updateUser,
  );

  const columns: ColumnConfig<User>[] = [
    {
      header: t('users.name'),
      accessor: (item) => `${item.first_name} ${item.last_name}`,
    },
    {
      header: t('users.email'),
      accessor: 'email',
    },
    {
      header: t('users.role'),
      accessor: (item) => t(`users.roles.${item.role}`),
    },
    {
      header: t('users.status'),
      accessor: (item) => (item.is_active ? t('common.active') : t('common.inactive')),
    },
    {
      header: t('users.lastLogin'),
      accessor: (item) =>
        item.last_login_at ? new Date(item.last_login_at).toLocaleString() : '-',
    },
  ];

  const userFields: FormField<User>[] = [
    {
      name: 'first_name',
      label: t('users.firstName'),
      type: 'text',
      required: true,
    },
    {
      name: 'last_name',
      label: t('users.lastName'),
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      label: t('users.email'),
      type: 'email',
      required: true,
    },
    {
      name: 'role',
      label: t('users.role'),
      type: 'select',
      options: [
        { value: 'client', label: t('users.roles.client') },
        { value: 'warehouse_worker', label: t('users.roles.warehouse_worker') },
        { value: 'manager', label: t('users.roles.manager') },
        { value: 'admin', label: t('users.roles.admin') },
        { value: 'director', label: t('users.roles.director') },
      ],
      required: true,
    },
    {
      name: 'phone_number',
      label: t('users.phone'),
      type: 'tel',
    },
    {
      name: 'is_active',
      label: t('users.active'),
      type: 'checkbox',
    },
  ];

  const handleSubmit = async (data: Partial<User>) => {
    if (!data.email || !data.first_name || !data.last_name || !data.role) {
      throw new Error(t('errors.requiredFieldsMissing'));
    }
    await formHandler.handleSubmit({
      updated_at: data.updated_at ?? new Date().toISOString(),
      created_at: data.created_at ?? new Date().toISOString(),
      is_active: data.is_active ?? true,
      role: data.role,
      last_name: data.last_name,
      first_name: data.first_name,
      email: data.email,
      phone_number: data.phone_number?.trim() || undefined,
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

      <GenericTable<User>
        title={t('users.title')}
        items={users}
        columns={columns}
        totalItems={users.length}
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
        title={modalNav.selectedEntity ? t('users.edit') : t('users.create')}
        fields={userFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={`${modalNav.selectedEntity?.first_name} ${modalNav.selectedEntity?.last_name}`}
      >
        <GenericDetailView
          items={[
            {
              label: 'users.firstName',
              value: modalNav.selectedEntity?.first_name,
            },
            {
              label: 'users.lastName',
              value: modalNav.selectedEntity?.last_name,
            },
            {
              label: 'users.email',
              value: modalNav.selectedEntity?.email,
            },
            {
              label: 'users.role',
              value: modalNav.selectedEntity?.role,
              format: (value) => t(`users.roles.${value}`),
            },
            {
              label: 'users.phone',
              value: modalNav.selectedEntity?.phone_number || '-',
            },
            {
              label: 'users.status',
              value: modalNav.selectedEntity?.is_active ? t('common.active') : t('common.inactive'),
            },
            {
              label: 'users.createdAt',
              value: modalNav.selectedEntity?.created_at
                ? new Date(modalNav.selectedEntity.created_at)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
            {
              label: 'users.lastLogin',
              value: modalNav.selectedEntity?.last_login_at
                ? new Date(modalNav.selectedEntity.last_login_at)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default UsersPage;
