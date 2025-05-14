import {
  ActionBar,
  Button,
  ButtonGroup,
  Checkbox,
  CheckboxRootProps,
  Flex,
  Heading,
  IconButton,
  Kbd,
  Pagination,
  Portal,
  Spinner,
  Stack,
  Table,
  useDisclosure,
} from '@chakra-ui/react';
import { CiEdit } from 'react-icons/ci';
import { LuChevronLeft, LuChevronRight, LuPlus, LuTrash2 } from 'react-icons/lu';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ProductFormModal } from '../components/ProductFormModal';
import { Product } from '../api/entity/product';
import { getProducts, deleteProduct } from '../api/products';
import { useToast } from '../components/ui/toaster';
import Layout from '../components/Layout';

const PAGE_SIZE = 5;

const ProductPage = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [selection, setSelection] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const { open, onOpen, onClose } = useDisclosure();

  const fetchProducts = async (page: number) => {
    setLoading(true);
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
      toast.showToast({
        title: t('errors.loadingFailed'),
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      fetchProducts(currentPage);
      toast.showToast({
        title: t('common.success'),
        description: t('products.deleteSuccess'),
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast.showToast({
        title: t('errors.deleteFailed'),
        type: 'error',
        duration: 3000,
      });
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selection.map((id) => deleteProduct(id)));
      fetchProducts(currentPage);
      setSelection([]);
      toast.showToast({
        title: t('common.success'),
        description: t('products.bulkDeleteSuccess'),
        type: 'success',
        duration: 3000,
      });
    } catch (error) {
      toast.showToast({
        title: t('errors.deleteFailed'),
        type: 'error',
        duration: 3000,
      });
    }
  };

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < products.length;

  const rows = products.map((product) => (
    <Table.Row key={product.id} data-selected={selection.includes(product.id) ? '' : undefined}>
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(product.id)}
          onCheckedChange={(changes: CheckboxRootProps) => {
            setSelection((prev) =>
              changes.checked ? [...prev, product.id] : selection.filter((id) => id !== product.id),
            );
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{product.name}</Table.Cell>
      <Table.Cell>{product.category_id}</Table.Cell>
      <Table.Cell>${product.price_purchase}</Table.Cell>
      <Table.Cell>${product.price}</Table.Cell>
      <Table.Cell>
        <ButtonGroup size="sm">
          <IconButton
            aria-label={t('common.edit')}
            onClick={() => {
              setSelectedProduct(product);
              onOpen();
            }}
          >
            <CiEdit />
          </IconButton>
          <IconButton
            aria-label={t('common.delete')}
            colorScheme="red"
            onClick={() => handleDelete(product.id)}
          >
            <LuTrash2 />
          </IconButton>
        </ButtonGroup>
      </Table.Cell>
    </Table.Row>
  ));

  if (loading && !products.length) {
    return (
      <Stack justify="center" align="center" height="100vh">
        <Spinner size="xl" />
      </Stack>
    );
  }

  return (
    <Layout>
      <Stack width="full" gap="5" p={4} mt={4}>
        <Flex justify="space-between" align="center">
          <Heading size="xl">{t('products.title')}</Heading>
          <Button colorScheme="green" onClick={() => onOpen()}>
            <LuPlus /> {t('products.add')}
          </Button>
        </Flex>
        <Table.ScrollArea
          borderWidth="1px"
          maxW={{ base: '100%', sm: '100%', md: '100%', lg: '100%' }}
          overflowX="auto"
        >
          <Table.Root variant="outline" size={{ base: 'sm', md: 'md' }}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader w="6">
                  <Checkbox.Root
                    size="sm"
                    top="0.5"
                    aria-label="Select all rows"
                    checked={indeterminate ? 'indeterminate' : selection.length > 0}
                    onCheckedChange={(changes: CheckboxRootProps) => {
                      setSelection(changes.checked ? products.map((item) => item.id) : []);
                    }}
                  >
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                  </Checkbox.Root>
                </Table.ColumnHeader>
                <Table.ColumnHeader>{t('products.name')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('products.category')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('products.purchasePrice')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('products.price')}</Table.ColumnHeader>
                <Table.ColumnHeader>{t('common.actions')}</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>

            <Table.Body>{rows}</Table.Body>
          </Table.Root>
        </Table.ScrollArea>

        <Pagination.Root
          count={totalItems}
          pageSize={PAGE_SIZE}
          page={currentPage}
          onPageChange={setCurrentPage}
        >
          <ButtonGroup variant="ghost" size="sm">
            <Pagination.PrevTrigger>
              <IconButton disabled={currentPage === 1}>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton
                  variant={{ base: 'ghost', _selected: 'outline' }}
                  disabled={page.value !== currentPage}
                >
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger>
              <IconButton disabled={currentPage >= Math.ceil(totalItems / PAGE_SIZE)}>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>

        <ActionBar.Root open={hasSelection}>
          <Portal>
            <ActionBar.Positioner>
              <ActionBar.Content>
                <ActionBar.SelectionTrigger>
                  {selection.length} {t('common.selected')}
                </ActionBar.SelectionTrigger>
                <ActionBar.Separator />
                <Button variant="outline" size="sm" colorScheme="red" onClick={handleBulkDelete}>
                  <LuTrash2 /> {t('common.delete')} <Kbd ml="2">⌫</Kbd>
                </Button>
              </ActionBar.Content>
            </ActionBar.Positioner>
          </Portal>
        </ActionBar.Root>
        <ProductFormModal
          isOpen={open}
          onClose={() => {
            onClose();
            setSelectedProduct(undefined);
          }}
          product={selectedProduct}
          onSuccess={() => fetchProducts(currentPage)}
        />
      </Stack>
    </Layout>
  );
};

export default ProductPage;
