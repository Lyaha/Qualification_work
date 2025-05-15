import { useTranslation } from 'react-i18next';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { useToast } from '../components/ui/toaster';
import { useCallback, useState } from 'react';
import { Category, Product } from '../api';
import {
  createListCollection,
  Portal,
  Select,
  SelectItemProps,
  useDisclosure,
} from '@chakra-ui/react';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../api/products';
import { FormField, GenericFormModal } from '../components/GenericModal';
import Layout from '../components/Layout';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import { getCategories } from '../api/categories';
import React from 'react';

const PAGE_SIZE = 5;
export const CustomSelectItem = React.forwardRef<
  HTMLDivElement,
  SelectItemProps & { children?: React.ReactNode; item: any; key: any }
>((props, ref) => {
  console.log('CustomSelectItem props:', props);
  return <Select.Item ref={ref} {...props} />;
});
CustomSelectItem.displayName = 'CustomSelectItem';

const ProductPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const { open, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const columns: ColumnConfig<Product>[] = [
    { header: t('products.name'), accessor: 'name' },
    { header: t('products.category'), accessor: 'category_id' },
    { header: t('products.purchasePrice'), accessor: 'price_purchase' },
    { header: t('products.price'), accessor: 'price' },
  ];

  const frameworks = createListCollection({
    items: [
      { label: 'React.js', value: 'react' },
      { label: 'Vue.js', value: 'vue' },
      { label: 'Angular', value: 'angular' },
      { label: 'Svelte', value: 'svelte' },
    ],
  });

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
      const response = await getCategories();
      if (response && Array.isArray(response)) {
        setCategories(response);
      } else {
        console.error('Неверный формат ответа API:', response);
      }
    } catch (error) {
      toast.showToast({ title: t('errors.loadingFailed'), type: 'error' });
    }
  }, [t, toast]);

  const handleSubmit = async (data: Product) => {
    setLoading(true);
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, data);
      } else {
        await createProduct(data);
      }
      await fetchProducts();
      onClose();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.submitFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

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
  useVisibilityPolling(fetchCategories, 60000);

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
        title={selectedProduct ? t('products.edit') : t('products.create')}
        fields={productFields}
        onSubmit={handleSubmit}
        initialValues={selectedProduct}
        isLoading={loading}
        submitText={selectedProduct ? 'common.save' : 'common.create'}
      />
      <Select.Root collection={frameworks} size="sm" width="320px">
        <Select.HiddenSelect />
        <Select.Label>Select framework</Select.Label>
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {frameworks.items.map((category: any) => (
                <Select.Item item={category.value} key={category.value}>
                  {category.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>
    </Layout>
  );
};

export default ProductPage;
