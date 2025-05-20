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
import { Supplier, createSupplier, deleteSupplier, getAllSuppliers, updateSupplier } from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const SuppliersPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const {
    data: suppliers,
    loading,
    refetch: fetchSuppliers,
  } = useFetchData<Supplier>(getAllSuppliers);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<Supplier>(
    fetchSuppliers,
    '/supplier',
  );
  const modalNav = useModalNavigation<Supplier>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<Supplier>(
    modalNav.selectedEntity,
    fetchSuppliers,
    createSupplier,
    updateSupplier,
  );

  const columns: ColumnConfig<Supplier>[] = [
    {
      header: t('suppliers.name'),
      accessor: 'name',
      width: '200px',
    },
    {
      header: t('suppliers.contactPerson'),
      accessor: 'contact_person',
    },
    {
      header: t('suppliers.phone'),
      accessor: 'phone',
    },
    {
      header: t('suppliers.email'),
      accessor: 'email',
    },
  ];

  const supplierFields: FormField<Supplier>[] = [
    {
      name: 'name',
      label: t('suppliers.name'),
      type: 'text',
      required: true,
    },
    {
      name: 'contact_person',
      label: t('suppliers.contactPerson'),
      type: 'text',
    },
    {
      name: 'phone',
      label: t('suppliers.phone'),
      type: 'tel',
    },
    {
      name: 'email',
      label: t('suppliers.email'),
      type: 'email',
    },
  ];

  const handleSubmit = async (data: Partial<Supplier>) => {
    if (!data.name) {
      throw new Error(t('error.supplierNameRequired'));
    }
    await formHandler.handleSubmit({
      ...data,
      name: data.name,
      contact_person: data.contact_person || undefined,
      phone: data.phone?.trim() || undefined,
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

      <GenericTable<Supplier>
        title={t('suppliers.title')}
        items={suppliers}
        columns={columns}
        totalItems={suppliers.length}
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
        title={modalNav.selectedEntity ? t('suppliers.edit') : t('suppliers.create')}
        fields={supplierFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={modalNav.selectedEntity?.name || t('suppliers.newSupplier')}
      >
        <GenericDetailView
          items={[
            {
              label: 'suppliers.name',
              value: modalNav.selectedEntity?.name,
            },
            {
              label: 'suppliers.contactPerson',
              value: modalNav.selectedEntity?.contact_person || '-',
            },
            {
              label: 'suppliers.phone',
              value: modalNav.selectedEntity?.phone || '-',
            },
            {
              label: 'suppliers.email',
              value: modalNav.selectedEntity?.email || '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default SuppliersPage;
