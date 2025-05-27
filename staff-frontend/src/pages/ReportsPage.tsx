import { useCallback, useState } from 'react';
import {
  Box,
  Flex,
  Heading,
  SimpleGrid,
  Select,
  createListCollection,
  Portal,
} from '@chakra-ui/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import Layout from '../components/Layout';
import { getReportsInventory, getReportsSale, getReportsTask } from '../api/reports';
import { useColorModeValue } from '../components/ui/color-mode';
import useVisibilityPolling from '../hooks/useVisibilityPolling';
import { getWarehouses } from '../api/warehouses';
import { Warehouse } from '../api/entity/warehouse';
import FormControl from '../components/ui/form-control';
import { subDays } from 'date-fns';
import ChartContainer from '../components/ChartContainer';
import StatBox from '../components/StatBox';
import DateRangePicker from '../components/DateRangePicker';

const ReportsPage = () => {
  const { t } = useTranslation();
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });
  const [warehouseFilter, setWarehouseFilter] = useState('all');
  const [salesData, setSalesData] = useState<any>(null);
  const [inventoryData, setInventoryData] = useState<any>(null);
  const [tasksData, setTasksData] = useState<any>(null);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);

  const fetchWarehouses = useCallback(async () => {
    try {
      const data = await getWarehouses();
      setWarehouses(data);
    } catch (error) {
      console.error('Error loading warehouses:', error);
    }
  }, []);

  const fetchReports = useCallback(async () => {
    try {
      let params = null;
      if (dateRange.start && dateRange.end) {
        params = {
          start: dateRange.start,
          end: dateRange.end,
          warehouse: warehouseFilter === 'all' ? undefined : warehouseFilter,
        };
      } else {
        params = {
          start: subDays(new Date(), 7),
          end: new Date(),
          warehouse: warehouseFilter === 'all' ? undefined : warehouseFilter,
        };
      }
      const sales = await getReportsSale(params);
      const inventory = await getReportsInventory();
      const tasks = await getReportsTask();

      setSalesData(sales);
      setInventoryData(inventory);
      setTasksData(tasks);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  }, [warehouseFilter, dateRange]);

  useVisibilityPolling(fetchReports, 10000);
  useVisibilityPolling(fetchWarehouses, 60000);

  const handelChangeSelect = (data: any) => {
    setWarehouseFilter(data.value[0]);
  };

  const handelChangeDate = (data: any) => {
    setDateRange(data);
  };

  // Цвета для графиков
  const barColor = useColorModeValue('#3182CE', '#63B3ED');
  const lineColor = useColorModeValue('#38A169', '#036e2c');
  const bg_tooltip = useColorModeValue('#ebebeb', '#163519');

  const warehouseCollection = createListCollection({
    items: [
      { value: 'all', label: t('reports.allWarehouses') },
      ...warehouses.map((w) => ({
        value: w.id,
        label: w.name,
      })),
    ],
  });

  return (
    <Layout>
      <Box p={4}>
        <Flex justify="space-between" mb={6}>
          <Heading size="xl">{t('reports.title')}</Heading>
          <Flex gap={4}>
            <FormControl label={t('reports.selectWarehouse')}>
              <Select.Root
                collection={warehouseCollection}
                onValueChange={(value) => handelChangeSelect(value)}
                positioning={{ sameWidth: true }}
              >
                <Select.HiddenSelect />
                <Select.Control>
                  <Select.Trigger width="200px">
                    <Select.ValueText>
                      {warehouseCollection.items.find((item) => item.value === warehouseFilter)
                        ?.label || t('reports.allWarehouses')}
                    </Select.ValueText>
                  </Select.Trigger>
                </Select.Control>

                <Portal>
                  <Select.Positioner style={{ zIndex: 1500 }}>
                    <Select.Content>
                      {warehouseCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          {item.label}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Portal>
              </Select.Root>
            </FormControl>
            <DateRangePicker onChange={handelChangeDate} />
          </Flex>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 3 }} padding={4} mb={8} gap={4}>
          <StatBox
            title={t('reports.totalSales')}
            value={`${salesData?.totalSales?.toFixed(2)} ₴`}
          />
          <StatBox title={t('reports.avgOrder')} value={`${salesData?.avgOrder?.toFixed(2)} ₴`} />
          <StatBox title={t('reports.ordersCount')} value={salesData?.ordersCount} />
        </SimpleGrid>

        <ChartContainer title={t('reports.salesTrend')}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData?.dailySales}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip contentStyle={{ backgroundColor: bg_tooltip }} />
              <Bar dataKey="total" fill={barColor} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>

        <SimpleGrid columns={{ base: 1, md: 2 }} padding={4} mt={8} gap={4}>
          <ChartContainer title={t('reports.inventoryLevels')}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={inventoryData}>
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: bg_tooltip }} />
                <Line type="monotone" dataKey="quantity" stroke={lineColor} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>

          <ChartContainer title={t('reports.taskCompletion')}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={tasksData}>
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip contentStyle={{ backgroundColor: bg_tooltip }} />
                <Bar dataKey="count" fill={barColor} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </SimpleGrid>
      </Box>
    </Layout>
  );
};

export default ReportsPage;
