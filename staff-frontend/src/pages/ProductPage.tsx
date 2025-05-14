import { useTranslation } from 'react-i18next';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { useToast } from '../components/ui/toaster';
import { useCallback, useState } from 'react';
import { Product } from '../api';
import { useDisclosure } from '@chakra-ui/react';
import { deleteProduct, getProducts } from '../api/products';
import { FormField, GenericFormModal } from '../components/GenericModal';
import Layout from '../components/Layout';
import useVisibilityPolling from '../hooks/useVisibilityPolling';

const PAGE_SIZE = 5;

const ProductPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const { open, onOpen, onClose } = useDisclosure();

  const columns: ColumnConfig<Product>[] = [
    { header: t('products.name'), accessor: 'name' },
    { header: t('products.category'), accessor: 'category_id' },
    { header: t('products.purchasePrice'), accessor: 'price_purchase' },
    { header: t('products.price'), accessor: 'price' },
  ];
  const productFields: FormField<Product>[] = [
    {
      name: 'name',
      label: t('products.name'),
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      label: t('products.description'),
      type: 'textarea',
    },
    {
      name: 'price',
      label: t('products.price'),
      type: 'number',
      required: true,
    },
    {
      name: 'category_id',
      label: t('products.category'),
      type: 'select',
      options: categories.map((c) => ({ value: c.id, label: c.name })),
      required: true,
    },
  ];

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getProducts();
      if (response && Array.isArray(response)) {
        setProducts(response);
        setTotalItems(response.length);
      } else {
        console.error('Неверный формат ответа API:', response);
        setProducts([]);
        setTotalItems(0);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    }
  }, [t, toast]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await getProducts();
      if (response && Array.isArray(response)) {
        setProducts(response);
        setTotalItems(response.length);
      } else {
        console.error('Неверный формат ответа API:', response);
        setProducts([]);
        setTotalItems(0);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    }
  }, [t, toast]);

  useVisibilityPolling(fetchProducts, 60000);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      await fetchProducts();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteProduct(id)));
      await fetchProducts();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.deleteFailed'), type: 'error' });
    }
  };

  return (
    <Layout>
      <GenericTable<Product>
        title={t('products.title')}
        items={products}
        columns={columns}
        totalItems={totalItems}
        currentPage={currentPage}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
        onDelete={handleDelete}
        onBulkDelete={handleBulkDelete}
        onAdd={onOpen}
        onEdit={setSelectedProduct}
        getId={(item) => item.id}
        isLoading={!products.length}
      />

      <GenericFormModal
        isOpen={open}
        onClose={onClose}
        title={product ? t('products.edit') : t('products.create')}
        fields={productFields}
        onSubmit={handleSubmit}
        initialValues={selectedProduct}
        isLoading={loading}
        submitText={product ? 'common.save' : 'common.create'}
      />
    </Layout>
  );
};

export default ProductPage;
