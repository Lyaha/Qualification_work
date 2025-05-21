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
import { createCategory, getCategories, updateCategory, Category } from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const CategoriesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const {
    data: categories,
    loading,
    refetch: fetchCategories,
  } = useFetchData<Category>(getCategories);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<Category>(
    fetchCategories,
    '/category',
  );
  const modalNav = useModalNavigation<Category>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<Category>(
    modalNav.selectedEntity,
    fetchCategories,
    createCategory,
    updateCategory,
  );

  const columns: ColumnConfig<Category>[] = [
    {
      header: t('categories.id'),
      accessor: 'id',
      width: '200px',
    },
    {
      header: t('categories.name'),
      accessor: 'name',
    },
    {
      header: t('categories.parent'),
      accessor: (item) =>
        categories
          .filter((c) => c.id !== modalNav.selectedEntity?.id)
          .find((c) => c.id === item.parent_id)?.name || '-',
    },
  ];

  const categoryFields: FormField<Category>[] = [
    {
      name: 'name',
      label: t('categories.name'),
      type: 'text',
      required: true,
    },
    {
      name: 'parent_id',
      label: t('categories.parentCategory'),
      type: 'select',
      options: categories.map((c) => ({ value: c.id, label: c.name })),
    },
  ];

  const handleSubmit = async (data: any) => {
    let selectedParent = null;
    if (data.parent_id) {
      if (typeof data.parent_id === 'string') {
        selectedParent = data.parent_id;
      } else {
        selectedParent = data.parent_id.value[0];
      }
    }
    if (!data.name) {
      throw new Error(t('error.requiredFieldsMissing'));
    }
    await formHandler.handleSubmit({
      name: data.name,
      parent_id: selectedParent || undefined,
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

      <GenericTable<Category>
        title={t('categories.title')}
        items={categories}
        columns={columns}
        totalItems={categories.length}
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
        title={modalNav.selectedEntity ? t('categories.edit') : t('categories.create')}
        fields={categoryFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={modalNav.selectedEntity?.name || ''}
      >
        <GenericDetailView
          items={[
            {
              label: 'categories.name',
              value: modalNav.selectedEntity?.name,
            },
            {
              label: 'categories.parentCategory',
              value:
                categories.find((c) => c.id === modalNav.selectedEntity?.parent_id)?.name || '-',
            },
            {
              label: 'categories.childCount',
              value: categories.filter((c) => c.parent_id === modalNav.selectedEntity?.id).length,
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default CategoriesPage;
