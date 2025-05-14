import { Dialog, Button, Box, Text, Input, Stack } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Product } from '../api/entity/product';
import { createProduct, updateProduct } from '../api/products';
import { useToast } from './ui/toaster';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSuccess: () => void;
}

export const ProductFormModal = ({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormModalProps) => {
  const { t } = useTranslation();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category_id: '',
    barcode: '',
    price_purchase: 0,
    price: 0,
    weight: 0,
    warehouse_id: '',
    storage_location: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description || '',
        category_id: product.category_id,
        barcode: product.barcode || '',
        price_purchase: product.price_purchase,
        price: product.price,
        weight: product.weight || 0,
        warehouse_id: product.warehouse_id,
        storage_location: product.storage_location || '',
      });
    }
  }, [product]);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (product) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      toast.showToast({
        title: t('common.success'),
        description: t(product ? 'products.updateSuccess' : 'products.createSuccess'),
        type: 'success',
      });
      onSuccess();
      onClose();
    } catch (error) {
      toast.showToast({
        title: t('common.error'),
        description: t(product ? 'products.updateError' : 'products.createError'),
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root isOpen={isOpen} onClose={onClose} size="xl">
      <Dialog.Content>
        <Dialog.Header>{product ? t('products.edit') : t('products.create')}</Dialog.Header>
        <Dialog.CloseTrigger />
        <Dialog.Body>
          <Stack padding={4}>
            <Box>
              <Text>{t('products.name')}</Text>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Box>

            <Box>
              <Text>{t('products.description')}</Text>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Box>

            <Box>
              <Text>{t('products.barcode')}</Text>
              <Input
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
              />
            </Box>

            <Box>
              <Text>{t('products.purchasePrice')}</Text>
              <Input
                value={formData.price_purchase}
                onChange={(value) => setFormData({ ...formData, price_purchase: Number(value) })}
              />
            </Box>

            <Box>
              <Text>{t('products.price')}</Text>
              <Input
                value={formData.price}
                onChange={(value) => setFormData({ ...formData, price: Number(value) })}
              />
            </Box>

            <Box>
              <Text>{t('products.weight')}</Text>
              <Input
                value={formData.weight}
                onChange={(value) => setFormData({ ...formData, weight: Number(value) })}
              />
            </Box>

            <Box>
              <Text>{t('products.storageLocation')}</Text>
              <Input
                value={formData.storage_location}
                onChange={(e) => setFormData({ ...formData, storage_location: e.target.value })}
              />
            </Box>
          </Stack>
        </Dialog.Body>

        <Dialog.Footer>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button colorScheme="blue" onClick={handleSubmit} loading={loading}>
            {product ? t('common.save') : t('common.create')}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
