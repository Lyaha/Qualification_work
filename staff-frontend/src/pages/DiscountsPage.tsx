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
  createDiscount,
  getAllDiscounts,
  updateDiscount,
  Discount,
  Product,
  Category,
  getProducts,
  getCategories,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const DiscountsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const {
    data: discounts,
    loading,
    refetch: fetchDiscounts,
  } = useFetchData<Discount>(getAllDiscounts);
  const { data: products } = useFetchData<Product>(getProducts);
  const { data: categories } = useFetchData<Category>(getCategories);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<Discount>(
    fetchDiscounts,
    '/discount',
  );
  const modalNav = useModalNavigation<Discount>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<Discount>(
    modalNav.selectedEntity,
    fetchDiscounts,
    createDiscount,
    updateDiscount,
  );

  const columns: ColumnConfig<Discount>[] = [
    {
      header: t('discounts.id'),
      accessor: 'id',
      width: '200px',
    },
    {
      header: t('discounts.name'),
      accessor: 'name',
    },
    {
      header: t('discounts.type'),
      accessor: (item) => t(`discounts.types.${item.discount_type}`),
    },
    {
      header: t('discounts.value'),
      accessor: (item) =>
        item.discount_type === 'percentage'
          ? `${item.value}%`
          : `${item.value}${t('units.currency')}`,
      align: 'right',
    },
    {
      header: t('discounts.period'),
      accessor: (item) =>
        `${new Date(item.start_date).toLocaleDateString()} - ${new Date(item.end_date).toLocaleDateString()}`,
    },
    {
      header: t('discounts.status'),
      accessor: (item) => (item.is_active ? t('common.active') : t('common.inactive')),
    },
  ];

  const discountFields: FormField<Discount>[] = [
    {
      name: 'name',
      label: t('discounts.name'),
      type: 'text',
      required: true,
    },
    {
      name: 'discount_type',
      label: t('discounts.type'),
      type: 'select',
      options: [
        { value: 'percentage', label: t('discounts.types.percentage') },
        { value: 'fixed', label: t('discounts.types.fixed') },
      ],
      required: true,
    },
    {
      name: 'value',
      label: t('discounts.value'),
      type: 'number',
      required: true,
      min: 0.01,
      step: 0.01,
    },
    {
      name: 'start_date',
      label: t('discounts.startDate'),
      type: 'date',
      required: true,
    },
    {
      name: 'end_date',
      label: t('discounts.endDate'),
      type: 'date',
      required: true,
    },
    {
      name: 'targetType',
      label: t('discounts.target'),
      type: 'radio-group',
      options: [
        { value: 'product', label: t('discounts.product') },
        { value: 'category', label: t('discounts.category') },
      ],
      required: true,
    },
    {
      name: 'product_id',
      label: t('discounts.product'),
      type: 'select',
      options: products.map((p) => ({ value: p.id, label: p.name })),
      required: (values) => values.targetType === 'product',
      dependsOn: ['targetType'],
      hidden: (values) => values.targetType !== 'product',
    },
    {
      name: 'category_id',
      label: t('discounts.category'),
      type: 'select',
      options: categories.map((c) => ({ value: c.id, label: c.name })),
      required: (values) => values.targetType === 'category',
      dependsOn: ['targetType'],
      hidden: (values) => values.targetType !== 'category',
    },
    {
      name: 'min_quantity',
      label: t('discounts.minQuantity'),
      type: 'number',
      min: 1,
    },
    {
      name: 'is_stackable',
      label: t('discounts.stackable'),
      type: 'checkbox',
    },
    {
      name: 'is_active',
      label: t('discounts.active'),
      type: 'checkbox',
    },
  ];

  const handleSubmit = async (data: any) => {
    let selectedId = null;
    if (data.targetType === 'product') {
      if (typeof data.product_id === 'string') {
        selectedId = data.product_id;
      } else {
        selectedId = data.product_id.value[0];
      }
    } else {
      if (typeof data.product_id === 'string') {
        selectedId = data.category_id;
      } else {
        selectedId = data.category_id.value[0];
      }
    }
    let selectedDisountType = null;
    if (typeof data.discount_type === 'string') {
      selectedDisountType = data.discount_type;
    } else {
      selectedDisountType = data.discount_type.value[0];
    }
    const discountData = {
      ...data,
      discount_type: selectedDisountType,
      product_id: data.targetType === 'product' ? selectedId : null,
      category_id: data.targetType === 'category' ? selectedId : null,
    };

    delete discountData.targetType;

    await formHandler.handleSubmit(discountData);
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

      <GenericTable<Discount>
        title={t('discounts.title')}
        items={discounts}
        columns={columns}
        totalItems={discounts.length}
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
        initialValues={{
          ...modalNav.selectedEntity,
          targetType: modalNav.selectedEntity?.product_id ? 'product' : 'category',
        }}
        title={modalNav.selectedEntity ? t('discounts.edit') : t('discounts.create')}
        fields={discountFields}
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
              label: 'discounts.name',
              value: modalNav.selectedEntity?.name,
            },
            {
              label: 'discounts.type',
              value: modalNav.selectedEntity?.discount_type,
              format: (value) => t(`discounts.types.${value}`),
            },
            {
              label: 'discounts.value',
              value: modalNav.selectedEntity?.value,
              format: (value) =>
                modalNav.selectedEntity?.discount_type === 'percentage'
                  ? `${modalNav.selectedEntity?.value}%`
                  : `${modalNav.selectedEntity?.value}${t('units.currency')}`,
            },
            {
              label: 'discounts.period',
              value: modalNav.selectedEntity
                ? `${new Date(modalNav.selectedEntity.start_date).toLocaleString()} - ${new Date(modalNav.selectedEntity.end_date).toLocaleString()}`
                : '-',
            },
            {
              label: 'discounts.target',
              value: modalNav.selectedEntity?.product_id
                ? products.find((p) => p.id === modalNav.selectedEntity?.product_id)?.name
                : categories.find((c) => c.id === modalNav.selectedEntity?.category_id)?.name,
            },
            {
              label: 'discounts.minQuantity',
              value: modalNav.selectedEntity?.min_quantity || '-',
            },
            {
              label: 'discounts.stackable',
              value: modalNav.selectedEntity?.is_stackable ? t('common.yes') : t('common.no'),
            },
            {
              label: 'discounts.status',
              value: modalNav.selectedEntity?.is_active ? t('common.active') : t('common.inactive'),
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default DiscountsPage;
