import { Box, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type DetailValueType = string | number | Date;

export interface DetailItem<T extends DetailValueType = DetailValueType> {
  label: string;
  value: T | null | undefined;
  format?: (value: T) => string;
  hidden?: boolean;
  hideIfEmpty?: boolean;
}

const defaultDateOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
} as const;

const formatValue = <T extends DetailValueType>(item: DetailItem<T>) => {
  if (item.value == null) return '-';

  if (item.format) {
    return item.format(item.value);
  }

  if (item.value instanceof Date) {
    return item.value.toLocaleDateString('uk-UA', defaultDateOptions);
  }

  return String(item.value);
};

export const GenericDetailView = ({ items }: { items: DetailItem[] }) => {
  const { t } = useTranslation();
  const visibleItems = items.filter((item) => !item.hidden);

  return (
    <Stack gap={3}>
      {visibleItems.map((item, index) => {
        if (item.hideIfEmpty && item.value == null) return null;

        return (
          <Box key={index}>
            <Text fontWeight="semibold">{t(item.label)}:</Text>
            <Text>{formatValue(item)}</Text>
          </Box>
        );
      })}
    </Stack>
  );
};
