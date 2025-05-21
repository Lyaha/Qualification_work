import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormControl from './ui/form-control';
import { Flex, Input } from '@chakra-ui/react';

const DateRangePicker = ({
  onChange,
}: {
  onChange: (range: { start: Date | null; end: Date | null }) => void;
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const { t } = useTranslation();
  const maxDate = new Date().toISOString().split('T')[0];

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    if (type === 'start') {
      setStartDate(value);
      if (endDate && value > endDate) setEndDate(value);
    } else {
      setEndDate(value);
    }
  };

  useEffect(() => {
    onChange({
      start: startDate ? new Date(startDate) : null,
      end: endDate ? new Date(endDate) : null,
    });
  }, [startDate, endDate]);

  return (
    <Flex gap={2} align="flex-end">
      <FormControl label={t('reports.startDate')}>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => handleDateChange('start', e.target.value)}
          max={endDate || undefined}
        />
      </FormControl>
      <FormControl label={t('reports.endDate')}>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => handleDateChange('end', e.target.value)}
          min={startDate || undefined}
          max={maxDate}
        />
      </FormControl>
    </Flex>
  );
};

export default DateRangePicker;
