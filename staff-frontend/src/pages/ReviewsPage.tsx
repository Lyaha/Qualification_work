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
  Review,
  createReview,
  getAllReviews,
  updateReview,
  User,
  Product,
  Order,
  getUsers,
  getProducts,
  getAllOrders,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const ReviewsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const editModal = useDisclosure();
  const detailModal = useDisclosure();

  // Загрузка данных
  const { data: reviews, loading, refetch: fetchReviews } = useFetchData<Review>(getAllReviews);
  const { data: users } = useFetchData<User>(getUsers);
  const { data: products } = useFetchData<Product>(getProducts);
  const { data: orders } = useFetchData<Order>(getAllOrders);

  // Универсальные хуки
  const { handleDelete, handleBulkDelete } = useCrudOperations<Review>(fetchReviews, '/review');
  const modalNav = useModalNavigation<Review>(navigate, detailModal.onOpen, editModal.onOpen);
  const formHandler = useFormHandler<Review>(
    modalNav.selectedEntity,
    fetchReviews,
    createReview,
    updateReview,
  );

  const columns: ColumnConfig<Review>[] = [
    {
      header: t('reviews.user'),
      accessor: (item) =>
        users.find((u) => u.id === item.user_id)
          ? `${users.find((u) => u.id === item.user_id)?.first_name} ${users.find((u) => u.id === item.user_id)?.last_name}`
          : t('common.unknown'),
    },
    {
      header: t('reviews.rating'),
      accessor: 'rating',
      format: (value) => '★'.repeat(value) + '☆'.repeat(5 - value),
    },
    {
      header: t('reviews.target'),
      accessor: (item) => {
        if (item.product_id) return t('reviews.product');
        if (item.order_id) return t('reviews.order');
        return '-';
      },
    },
    {
      header: t('reviews.createdAt'),
      accessor: 'created_at',
      format: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const reviewFields: FormField<Review>[] = [
    {
      name: 'user_id',
      label: t('reviews.user'),
      type: 'select',
      options: users.map((u) => ({ value: u.id, label: `${u.first_name} ${u.last_name}` })),
      required: true,
    },
    {
      name: 'reviewType',
      label: t('reviews.reviewType'),
      type: 'radio-group',
      options: [
        { value: 'product', label: t('reviews.product') },
        { value: 'order', label: t('reviews.order') },
      ],
      required: true,
    },
    {
      name: 'product_id',
      label: t('reviews.product'),
      type: 'select',
      options: products.map((p) => ({ value: p.id, label: p.name })),
      required: (values) => values.reviewType === 'product',
      dependsOn: ['reviewType'],
      hidden: (values) => values.reviewType !== 'product',
    },
    {
      name: 'order_id',
      label: t('reviews.order'),
      type: 'select',
      options: orders.map((o) => ({ value: o.id, label: `Order #${o.id.slice(0, 8)}` })),
      required: (values) => values.reviewType === 'order',
      dependsOn: ['reviewType'],
      hidden: (values) => values.reviewType !== 'order',
    },
    {
      name: 'rating',
      label: t('reviews.rating'),
      type: 'select',
      options: [1, 2, 3, 4, 5].map((value) => ({
        value,
        label: '★'.repeat(value) + '☆'.repeat(5 - value),
      })),
      required: true,
    },
    {
      name: 'comment',
      label: t('reviews.comment'),
      type: 'textarea',
    },
  ];

  const handleSubmit = async (data: any) => {
    const reviewData = {
      ...data,
      product_id: data.reviewType === 'product' ? data.product_id : null,
      order_id: data.reviewType === 'order' ? data.order_id : null,
    };

    delete reviewData.reviewType;

    await formHandler.handleSubmit(reviewData);
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

      <GenericTable<Review>
        title={t('reviews.title')}
        items={reviews}
        columns={columns}
        totalItems={reviews.length}
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
          reviewType: modalNav.selectedEntity?.product_id ? 'product' : 'order',
        }}
        title={modalNav.selectedEntity ? t('reviews.edit') : t('reviews.create')}
        fields={reviewFields}
        onSubmit={handleSubmit}
        submitText={modalNav.selectedEntity ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={`${t('reviews.review')} #${modalNav.selectedEntity?.id.slice(0, 8)}`}
      >
        <GenericDetailView
          items={[
            {
              label: 'reviews.user',
              value: users.find((u) => u.id === modalNav.selectedEntity?.user_id)
                ? `${users.find((u) => u.id === modalNav.selectedEntity?.user_id)?.first_name} ${users.find((u) => u.id === modalNav.selectedEntity?.user_id)?.last_name}`
                : '-',
            },
            {
              label: 'reviews.rating',
              value: modalNav.selectedEntity?.rating,
              format: (value) => '★'.repeat(Number(value)) + '☆'.repeat(5 - Number(value)),
            },
            {
              label: 'reviews.target',
              value: modalNav.selectedEntity?.product_id
                ? `${t('reviews.product')}: ${
                    products.find((p) => p.id === modalNav.selectedEntity?.product_id)?.name
                  }`
                : `${t('reviews.order')} #${orders
                    .find((o) => o.id === modalNav.selectedEntity?.order_id)
                    ?.id.slice(0, 8)}`,
            },
            {
              label: 'reviews.comment',
              value: modalNav.selectedEntity?.comment || '-',
            },
            {
              label: 'reviews.createdAt',
              value: modalNav.selectedEntity?.created_at
                ? new Date(modalNav.selectedEntity.created_at)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default ReviewsPage;
