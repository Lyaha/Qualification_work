import {
  ActionBar,
  Box,
  Button,
  ButtonGroup,
  Checkbox,
  Flex,
  Heading,
  IconButton,
  Kbd,
  Pagination,
  Portal,
  Spinner,
  Stack,
  Table,
  Input,
} from '@chakra-ui/react';
import {
  LuChevronLeft,
  LuChevronRight,
  LuPlus,
  LuTrash2,
  LuEye,
  LuArrowUp,
  LuArrowDown,
} from 'react-icons/lu';
import { CiEdit } from 'react-icons/ci';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
type DisableableAction = 'add' | 'edit' | 'delete' | 'bulkDelete';

export type ColumnConfig<T> = {
  header: string;
  accessor: keyof T | ((item: T) => React.ReactNode);
  width?: string | number;
  align?: 'left' | 'center' | 'right';
  format?: (value: any) => React.ReactNode; // Форматирование значения
  hidden?: boolean; // Скрытие колонки
};

type GenericTableProps<T> = {
  title: string;
  items: T[];
  columns: ColumnConfig<T>[];
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDelete?: (id: string) => void;
  onBulkDelete?: (ids: string[]) => void;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  getId: (item: T) => string;
  isLoading?: boolean;
  isView?: boolean;
  onView?: (item: T) => void;
  additionalActions?: (item: T) => React.ReactNode;
  disableActions?: DisableableAction[];
};

type SortDirection = 'asc' | 'desc' | null;

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
  isView = false,
  onView,
  additionalActions,
  disableActions = [],
}: GenericTableProps<T>) => {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<string[]>([]);
  const showAdd = !disableActions.includes('add');
  const showEdit = !disableActions.includes('edit');
  const showDelete = !disableActions.includes('delete');
  const showBulkDelete = !disableActions.includes('bulkDelete');

  const visibleColumns = columns.filter((column) => !column.hidden);

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < items.length;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    return columns.some((column) => {
      const value =
        typeof column.accessor === 'function'
          ? column.accessor(item)
          : item[column.accessor as keyof T];
      return String(value).toLowerCase().includes(searchQuery.toLowerCase());
    });
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    // Проверка на даты
    const isDate = (value: unknown): boolean => {
      if (value instanceof Date) return true;
      if (typeof value === 'string') return !isNaN(Date.parse(value));
      return false;
    };

    // Проверка на числа (включая строковые представления чисел)
    const isNumber = (value: unknown): boolean => {
      if (typeof value === 'number') return true;
      if (typeof value === 'string') return !isNaN(Number(value)) && !isNaN(parseFloat(value));
      return false;
    };

    // Сортировка по датам
    if (isDate(aValue) && isDate(bValue)) {
      const dateA = new Date(aValue as string | Date);
      const dateB = new Date(bValue as string | Date);
      return sortDirection === 'asc'
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime();
    }

    // Сортировка по числам
    if (isNumber(aValue) && isNumber(bValue)) {
      const numA = typeof aValue === 'string' ? parseFloat(aValue) : Number(aValue);
      const numB = typeof bValue === 'string' ? parseFloat(bValue) : Number(bValue);
      return sortDirection === 'asc' ? numA - numB : numB - numA;
    }

    // Стандартная строковая сортировка
    const stringA = String(aValue).toLowerCase();
    const stringB = String(bValue).toLowerCase();
    return sortDirection === 'asc'
      ? stringA.localeCompare(stringB)
      : stringB.localeCompare(stringA);
  });

  const handleSort = (column: ColumnConfig<T>) => {
    if (typeof column.accessor !== 'string') {
      //console.log(column, '   ', typeof column.accessor);
      return;
    }

    const accessor = column.accessor as keyof T;

    setSortDirection((prev) => {
      if (!prev || sortColumn !== accessor) return 'asc';
      if (prev === 'asc') return 'desc';
      return null;
    });

    setSortColumn((prev) => (prev === accessor && sortDirection === 'desc' ? null : accessor));
  };

  const handleSelectAll = (checked: boolean | string) => {
    setSelection(checked ? currentItems.map((item) => getId(item)) : []);
  };

  const handleSelectItem = (id: string, checked: boolean | string) => {
    setSelection((prev) => (checked ? [...prev, id] : prev.filter((itemId) => itemId !== id)));
  };

  const totalPages = Math.ceil(sortedItems.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = sortedItems.slice(startIndex, endIndex);

  return (
    <Stack width="full" gap="5" p={4}>
      <Flex justify="space-between" align="center">
        <Heading size="xl">{title}</Heading>
        <Box flex="1" maxW="300px" ml={4}>
          <Input
            placeholder={t('common.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Box>
        {showAdd && (
          <Button colorScheme="green" onClick={onAdd}>
            <LuPlus /> {t('common.add')}
          </Button>
        )}
      </Flex>

      <Table.ScrollArea borderWidth="1px" overflowX="auto">
        <Table.Root variant="outline" gap="5" size={{ base: 'sm', md: 'md' }}>
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
              {visibleColumns.map((column, index) => (
                <Table.ColumnHeader key={index} width={column.width} textAlign={column.align}>
                  <Flex
                    key={index}
                    width={column.width}
                    textAlign={column.align}
                    cursor={typeof column.accessor === 'string' ? 'pointer' : 'default'}
                    onClick={() => handleSort(column)}
                  >
                    <Flex align="center" gap={2}>
                      {column.header}
                      {sortColumn === column.accessor && (
                        <>
                          {sortDirection === 'asc' && <LuArrowUp size={14} />}
                          {sortDirection === 'desc' && <LuArrowDown size={14} />}
                        </>
                      )}
                    </Flex>
                  </Flex>
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
              currentItems.map((item) => {
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
                    {visibleColumns.map((column, colIndex) => (
                      <Table.Cell key={colIndex} textAlign={column.align}>
                        {typeof column.accessor === 'function'
                          ? column.accessor(item)
                          : column.format
                            ? column.format((item as any)[column.accessor])
                            : (item as any)[column.accessor]}
                      </Table.Cell>
                    ))}
                    <Table.Cell>
                      <ButtonGroup size="sm">
                        {isView && (
                          <IconButton aria-label={t('common.view')} onClick={() => onView?.(item)}>
                            <LuEye />
                          </IconButton>
                        )}
                        {showEdit && onEdit && (
                          <IconButton aria-label={t('common.edit')} onClick={() => onEdit(item)}>
                            <CiEdit />
                          </IconButton>
                        )}
                        {showDelete && onDelete && (
                          <IconButton
                            aria-label={t('common.delete')}
                            colorScheme="red"
                            onClick={() => onDelete(getId(item))}
                          >
                            <LuTrash2 />
                          </IconButton>
                        )}
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

      <Pagination.Root
        count={totalItems}
        pageSize={pageSize}
        page={currentPage}
        onPageChange={(e) => onPageChange(e.page)}
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
                disabled={page.value === currentPage}
              >
                {page.value}
              </IconButton>
            )}
          />

          <Pagination.NextTrigger>
            <IconButton disabled={currentPage >= totalPages}>
              <LuChevronRight />
            </IconButton>
          </Pagination.NextTrigger>
        </ButtonGroup>
      </Pagination.Root>

      <ActionBar.Root open={hasSelection && showBulkDelete}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selection.length} {t('common.selected')}
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              {onBulkDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  colorScheme="red"
                  onClick={() => onBulkDelete(selection)}
                >
                  <LuTrash2 /> {t('common.delete')} <Kbd ml="2">⌫</Kbd>
                </Button>
              )}
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </Stack>
  );
};
