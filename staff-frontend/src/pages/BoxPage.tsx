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
import { createBox, getAllBox, updateBox, Box as BoxType } from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const BoxesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  const { data: boxes, loading, refetch: fetchBoxes } = useFetchData<BoxType>(getAllBox);

  const { handleDelete, handleBulkDelete } = useCrudOperations<BoxType>(fetchBoxes, '/box');
  const modalNav = useModalNavigation<BoxType>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<BoxType>(
    modalNav.selectedEntity,
    fetchBoxes,
    createBox,
    updateBox,
  );

  const columns: ColumnConfig<BoxType>[] = [
    {
      header: t('boxes.id'),
      accessor: 'id',
      width: '200px',
    },
    {
      header: t('boxes.name'),
      accessor: 'name',
    },
    {
      header: t('boxes.dimensions'),
      accessor: (item) => `${item.length} × ${item.width} × ${item.height} ${t('units.m')}`,
    },
    {
      header: t('boxes.maxWeight'),
      accessor: (item) => `${item.max_weight} ${t('units.kg')}`,
      align: 'right',
    },
  ];

  const boxFields: FormField<BoxType>[] = [
    {
      name: 'name',
      label: t('boxes.name'),
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: t('boxes.description'),
      type: 'textarea',
    },
    {
      name: 'length',
      label: t('boxes.length'),
      type: 'number',
      required: true,
      min: 0.01,
      step: 0.01,
    },
    {
      name: 'width',
      label: t('boxes.width'),
      type: 'number',
      required: true,
      min: 0.01,
      step: 0.01,
    },
    {
      name: 'height',
      label: t('boxes.height'),
      type: 'number',
      required: true,
      min: 0.01,
      step: 0.01,
    },
    {
      name: 'max_weight',
      label: t('boxes.maxWeight'),
      type: 'number',
      required: true,
      min: 0.1,
      step: 0.1,
    },
  ];

  const handleSubmit = async (data: any) => {
    await formHandler.handleSubmit({
      ...data,
      length: Number(data.length),
      width: Number(data.width),
      description: data.description,
      height: Number(data.height),
      max_weight: Number(data.max_weight),
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

      <GenericTable<BoxType>
        title={t('boxes.title')}
        items={boxes}
        columns={columns}
        totalItems={boxes.length}
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
        title={modalNav.selectedEntity ? t('boxes.edit') : t('boxes.create')}
        fields={boxFields}
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
              label: 'boxes.name',
              value: modalNav.selectedEntity?.name,
            },
            {
              label: 'boxes.description',
              value: modalNav.selectedEntity?.description || '-',
            },
            {
              label: 'boxes.dimensions',
              value: modalNav.selectedEntity
                ? `${modalNav.selectedEntity.length} × ${modalNav.selectedEntity.width} × ${modalNav.selectedEntity.height} ${t('units.m')}`
                : '-',
            },
            {
              label: 'boxes.maxWeight',
              value: modalNav.selectedEntity?.max_weight
                ? `${modalNav.selectedEntity.max_weight} ${t('units.kg')}`
                : '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default BoxesPage;
