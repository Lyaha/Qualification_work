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
} from '@chakra-ui/react';
import { LuChevronLeft, LuChevronRight, LuPlus, LuTrash2 } from 'react-icons/lu';
import { CiEdit } from 'react-icons/ci';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export type ColumnConfig<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  width?: string | number;
  align?: 'left' | 'center' | 'right';
};

type GenericTableProps<T> = {
  title: string;
  items: T[];
  columns: ColumnConfig<T>[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
  onAdd: () => void;
  onEdit: (item: T) => void;
  getId: (item: T) => string;
  isLoading?: boolean;
  additionalActions?: (item: T) => React.ReactNode;
};

export const GenericTable = <T,>({
  title,
  items,
  columns,
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onDelete,
  onBulkDelete,
  onAdd,
  onEdit,
  getId,
  isLoading = false,
  additionalActions,
}: GenericTableProps<T>) => {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<string[]>([]);

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < items.length;

  const handleSelectAll = (checked: boolean | string) => {
    setSelection(checked ? items.map((item) => getId(item)) : []);
  };

  const handleSelectItem = (id: string, checked: boolean | string) => {
    setSelection((prev) => (checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)));
  };

  return (
    <Stack width="full" gap="5" p={4}>
      <Flex justify="space-between" align="center">
        <Heading size="xl">{title}</Heading>
        <Button colorScheme="green" onClick={onAdd}>
          <LuPlus /> {t('common.add')}
        </Button>
      </Flex>

      <Table.ScrollArea borderWidth="1px" overflowX="auto">
        <Table.Root variant="outline" size={{ base: 'sm', md: 'md' }}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader w="6">
                <Checkbox.Root
                  size="sm"
                  checked={indeterminate ? 'indeterminate' : selection.length > 0}
                  onCheckedChange={(changes) => handleSelectAll(changes.checked)}
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                </Checkbox.Root>
              </Table.ColumnHeader>
              {columns.map((column, index) => (
                <Table.ColumnHeader key={index} width={column.width} textAlign={column.align}>
                  {column.header}
                </Table.ColumnHeader>
              ))}
              <Table.ColumnHeader>{t('common.actions')}</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {isLoading ? (
              <Table.Row>
                <Table.Cell colSpan={columns.length + 2} textAlign="center">
                  <Spinner size="xl" />
                </Table.Cell>
              </Table.Row>
            ) : items.length > 0 ? (
              items.map((item) => {
                const itemId = getId(item);
                return (
                  <Table.Row
                    key={itemId}
                    data-selected={selection.includes(itemId) ? '' : undefined}
                  >
                    <Table.Cell>
                      <Checkbox.Root
                        size="sm"
                        checked={selection.includes(itemId)}
                        onCheckedChange={(changes) => handleSelectItem(itemId, changes.checked)}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control />
                      </Checkbox.Root>
                    </Table.Cell>
                    {columns.map((column, colIndex) => (
                      <Table.Cell key={colIndex} textAlign={column.align}>
                        {typeof column.accessor === 'function'
                          ? column.accessor(item)
                          : (item as any)[column.accessor]}
                      </Table.Cell>
                    ))}
                    <Table.Cell>
                      <ButtonGroup size="sm">
                        <IconButton aria-label={t('common.edit')} onClick={() => onEdit(item)}>
                          <CiEdit />
                        </IconButton>
                        <IconButton
                          aria-label={t('common.delete')}
                          colorScheme="red"
                          onClick={() => onDelete(getId(item))}
                        >
                          <LuTrash2 />
                        </IconButton>
                        {additionalActions && additionalActions(item)}
                      </ButtonGroup>
                    </Table.Cell>
                  </Table.Row>
                );
              })
            ) : (
              <Table.Row>
                <Table.Cell colSpan={columns.length + 2} textAlign="center">
                  {t('common.noData')}
                </Table.Cell>
              </Table.Row>
            )}
          </Table.Body>
        </Table.Root>
      </Table.ScrollArea>

      <Pagination.Root count={totalItems} pageSize={pageSize} page={currentPage}>
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
            <IconButton disabled={currentPage >= Math.ceil(totalItems / pageSize)}>
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
              <Button
                variant="outline"
                size="sm"
                colorScheme="red"
                onClick={() => onBulkDelete(selection)}
              >
                <LuTrash2 /> {t('common.delete')} <Kbd ml="2">⌫</Kbd>
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </Stack>
  );
};
