import { useTranslation } from 'react-i18next';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { useState } from 'react';
import Layout from '../components/Layout';
import { Box, Button, useDisclosure, Text } from '@chakra-ui/react';
import { LuArrowLeft } from 'react-icons/lu';
import { useNavigate, useParams } from 'react-router-dom';
import { GenericDetailView } from '../components/GenericDetailView';
import useFetchData from '../hooks/useUniversalFetchData';
import useModalNavigation from '../hooks/useModalNavigation';
import {
  PriceHistory,
  getPriceHistoryByProduct,
  getAllPriceHistorys,
  Product,
  User,
  getProducts,
  getUsers,
} from '../api';
import DetailModal from '../components/DetailModal';

const PAGE_SIZE = 5;

const PriceHistoryPage = () => {
  const { t } = useTranslation();
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // Модальные окна
  const detailModal = useDisclosure();
  const modalNav = useModalNavigation<PriceHistory>(navigate, detailModal.onOpen);

  // Загрузка данных
  const {
    data: history,
    loading,
    refetch,
  } = useFetchData<PriceHistory>(
    productId ? getPriceHistoryByProduct : getAllPriceHistorys,
    productId,
  );
  const { data: products } = useFetchData<Product>(getProducts);
  const { data: users } = useFetchData<User>(getUsers);

  const columns: ColumnConfig<PriceHistory>[] = [
    {
      header: t('priceHistory.product'),
      accessor: (item) =>
        products.find((p) => p.id === item.product_id)?.name || t('common.unknown'),
    },
    {
      header: t('priceHistory.oldPrice'),
      accessor: (item) => `${item.old_price} ${t('units.currency')}`,
      align: 'right',
    },
    {
      header: t('priceHistory.newPrice'),
      accessor: (item) => `${item.new_price} ${t('units.currency')}`,
      align: 'right',
    },
    {
      header: t('priceHistory.changedBy'),
      accessor: (item) =>
        users.find((u) => u.id === item.changed_by)
          ? `${users.find((u) => u.id === item.changed_by)?.first_name} ${users.find((u) => u.id === item.changed_by)?.last_name}`
          : t('common.unknown'),
    },
    {
      header: t('priceHistory.changedAt'),
      accessor: (item) =>
        item.changed_at ? new Date(item.changed_at).toLocaleDateString() : t('common.notSpecified'),
    },
  ];

  return (
    <Layout>
      <Box mb={4}>
        <Button onClick={() => navigate(-1)} variant="outline">
          <LuArrowLeft />
          {t('common.back')}
        </Button>
        {productId && (
          <Text fontSize="xl" mt={2}>
            {t('priceHistory.forProduct')}: {products.find((p) => p.id === productId)?.name}
          </Text>
        )}
      </Box>

      <GenericTable<PriceHistory>
        title={productId ? t('priceHistory.titleForProduct') : t('priceHistory.title')}
        items={history}
        columns={columns}
        totalItems={history.length}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        pageSize={PAGE_SIZE}
        getId={(item) => item.id}
        isView={true}
        onView={modalNav.handleDetail}
        disableActions={['add', 'edit', 'delete', 'bulkDelete']}
      />

      <DetailModal
        isOpen={detailModal.open}
        onClose={detailModal.onClose}
        title={t('priceHistory.detailsTitle')}
      >
        <GenericDetailView
          items={[
            {
              label: 'priceHistory.product',
              value: products.find((p) => p.id === modalNav.selectedEntity?.product_id)?.name,
            },
            {
              label: 'priceHistory.oldPrice',
              value: modalNav.selectedEntity?.old_price,
              format: (value) => `${Number(value).toFixed(2)}  ${t('unit.currecny')}`,
            },
            {
              label: 'priceHistory.newPrice',
              value: modalNav.selectedEntity?.new_price,
              format: (value) => `${Number(value).toFixed(2)}  ${t('unit.currecny')}`,
            },
            {
              label: 'priceHistory.priceChange',
              value:
                modalNav.selectedEntity &&
                `${(
                  ((modalNav.selectedEntity.new_price - modalNav.selectedEntity.old_price) /
                    modalNav.selectedEntity.old_price) *
                  100
                ).toFixed(1)}%`,
            },
            {
              label: 'priceHistory.changedBy',
              value: users.find((u) => u.id === modalNav.selectedEntity?.changed_by)
                ? `${users.find((u) => u.id === modalNav.selectedEntity?.changed_by)?.first_name} ${users.find((u) => u.id === modalNav.selectedEntity?.changed_by)?.last_name}`
                : '-',
            },
            {
              label: 'priceHistory.changedAt',
              value: modalNav.selectedEntity?.changed_at
                ? new Date(modalNav.selectedEntity.changed_at)
                : null,
              format: (date) => date?.toLocaleString() || '-',
            },
          ]}
        />
      </DetailModal>
    </Layout>
  );
};

export default PriceHistoryPage;
