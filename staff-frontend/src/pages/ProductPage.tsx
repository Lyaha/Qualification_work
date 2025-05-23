import { useTranslation } from 'react-i18next';
import { ColumnConfig, GenericTable } from '../components/GenericTable';
import { useToast } from '../components/ui/toaster';
import { useCallback, useState } from 'react';
import { Category, Product } from '../api';
import { Button, useDisclosure, Text, Stack, Box } from '@chakra-ui/react';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../api/products';
import { FormField, GenericFormModal } from '../components/GenericModal';
import Layout from '../components/Layout';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import { createCategory, getCategories } from '../api/categories';
import DetailModal from '../components/DetailModal';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 5;

const ProductPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const {
    open: OpenEditModal,
    onOpen: onOpenEditModal,
    onClose: onCloseEditModal,
  } = useDisclosure();
  const {
    open: OpenDetailModal,
    onOpen: onOpenDetailModal,
    onClose: onCloseDetailModal,
  } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const navigate = useNavigate();

  const columns: ColumnConfig<Product>[] = [
    { header: t('products.name'), accessor: 'name' },
    {
      header: t('products.category'),
      accessor: (item) => categories.find((c) => c.id === item.category_id)?.name,
    },
    { header: t('products.purchasePrice'), accessor: 'price_purchase' },
    { header: t('products.price'), accessor: 'price' },
  ];

  const productFields: FormField<Product>[] = [
    {
      name: 'name',
      label: t('products.name'),
      type: 'text',
      required: true,
      placeholder: t('products.namePlaceholder'),
    },
    {
      name: 'description',
      label: t('products.description'),
      type: 'textarea',
      placeholder: t('products.descriptionPlaceholder'),
    },
    {
      name: 'barcode',
      label: t('products.barcode'),
      type: 'text',
      placeholder: t('products.barcodePlaceholder'),
    },
    {
      name: 'price_purchase',
      label: t('products.purchasePrice'),
      type: 'number',
      required: true,
      min: 0,
      step: 0.01,
      placeholder: t('products.purchasePricePlaceholder'),
    },
    {
      name: 'price',
      label: t('products.price'),
      type: 'number',
      required: true,
      min: 0,
      step: 0.01,
      placeholder: t('products.pricePlaceholder'),
    },
    {
      name: 'weight',
      label: t('products.weight'),
      type: 'number',
      min: 0,
      step: 0.1,
      placeholder: t('products.weightPlaceholder'),
    },
    {
      name: 'category_id',
      label: t('products.category'),
      type: 'select',
      options: categories.map((c) => ({
        value: c.id,
        label: c.name,
      })),
      required: true,
      placeholder: t('products.selectCategory'),
      onCreateNew: async (name) => {
        const newCategory = await createCategory(name);
        fetchCategories();
        return { value: newCategory.id, label: newCategory.name };
      },
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

  const handleSubmit = async (data: any) => {
    setLoading(true);
    //console.log(data);
    try {
      let selectedCategory = null;
      if (typeof data.category_id === 'string') {
        selectedCategory = categories.find((c) => c.id === data.category_id);
      } else {
        selectedCategory = categories.find((c) => c.id === data.category_id.value[0]);
      }
      if (!selectedCategory) {
        throw new Error(t('errors.categoryRequired'));
      }
      //console.log(data);
      const productData = {
        name: data.name,
        description: data.description,
        barcode: data.barcode,
        price_purchase: data.price_purchase,
        price: data.price,
        weight: data.weight,
        category_id: selectedCategory.id,
        category: selectedCategory,
      };
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, productData);
      } else {
        await createProduct(productData);
      }
      await fetchProducts();
      onCloseEditModal();
      toast.showToast({ title: t('common.success'), type: 'success' });
    } catch (error) {
      toast.showToast({ title: t('errors.submitFailed'), type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  const handleAdd = () => {
    setSelectedProduct(undefined);
    onOpenEditModal();
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onOpenEditModal();
  };

  const handelDetail = (product: Product) => {
    setSelectedProduct(product);
    onOpenDetailModal();
  };

  const handelNavigate = () => {
    if (selectedProduct) {
      navigate(`/batches/${selectedProduct.id}`);
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
        onAdd={handleAdd}
        onEdit={handleEdit}
        getId={(item) => item.id}
        isLoading={!products.length}
        isView={true}
        onView={handelDetail}
      />

      <GenericFormModal
        isOpen={OpenEditModal}
        onClose={onCloseEditModal}
        initialValues={selectedProduct}
        title={selectedProduct ? t('products.edit') : t('products.create')}
        fields={productFields}
        onSubmit={handleSubmit}
        isLoading={loading}
        submitText={selectedProduct ? 'common.save' : 'common.create'}
      />

      <DetailModal
        isOpen={OpenDetailModal}
        onClose={onCloseDetailModal}
        title={selectedProduct?.name || ''}
        additionalButton={<Button onClick={handelNavigate}>{t('products.batches')}</Button>}
      >
        <Stack gap={3}>
          {selectedProduct?.id && (
            <Box>
              <Text fontWeight="semibold">{t('products.id')}:</Text>
              <Text>{selectedProduct.id}</Text>
            </Box>
          )}

          {selectedProduct?.barcode && (
            <Box>
              <Text fontWeight="semibold">{t('products.barcode')}:</Text>
              <Text>{selectedProduct.barcode}</Text>
            </Box>
          )}

          <Box>
            <Text fontWeight="semibold">{t('products.category')}:</Text>
            <Text>
              {categories.find((c) => c.id === selectedProduct?.category_id)?.name || '-'}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('products.description')}:</Text>
            <Text>{selectedProduct?.description || '-'}</Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('products.price')}:</Text>
            <Text>
              {selectedProduct?.price
                ? new Intl.NumberFormat('uk-UA', {
                    style: 'currency',
                    currency: 'UAH',
                  }).format(Number(selectedProduct.price))
                : '-'}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('products.purchasePrice')}:</Text>
            <Text>
              {selectedProduct?.price_purchase
                ? new Intl.NumberFormat('uk-UA', {
                    style: 'currency',
                    currency: 'UAH',
                  }).format(Number(selectedProduct.price_purchase))
                : '-'}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('products.weight')}:</Text>
            <Text>
              {selectedProduct?.weight
                ? `${new Intl.NumberFormat('ru-RU').format(Number(selectedProduct.weight))} кг`
                : '-'}
            </Text>
          </Box>

          <Box>
            <Text fontWeight="semibold">{t('products.updatedAt')}:</Text>
            <Text>
              {selectedProduct?.updated_at
                ? new Date(selectedProduct.updated_at).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '-'}
            </Text>
          </Box>
        </Stack>
      </DetailModal>
    </Layout>
  );
};

export default ProductPage;
