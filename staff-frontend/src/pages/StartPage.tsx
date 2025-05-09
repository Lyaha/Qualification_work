import { Box, Heading, Grid } from '@chakra-ui/react';
import Layout from '../components/Layout';
import TaskCard from '../components/TaskCard';

const StartPage = () => {
  const tasks: Array<{
    id: string;
    type: 'order' | 'supply';
    product: string;
    quantity: number;
    deadline: string;
    status: 'pending' | 'in_progress' | 'completed';
    client?: string;
    supplier?: string;
    total?: number;
    unitPrice?: number;
  }> = [
    {
      id: 'uuid634463',
      type: 'order',
      product: 'Название продукта',
      quantity: 10,
      deadline: '2025-05-07T19:00:00Z',
      status: 'in_progress',
      client: 'Имя клиента',
      total: 15000,
    },
    {
      id: 'uuid123',
      type: 'supply',
      product: 'Комплектующие',
      quantity: 50,
      deadline: '2025-05-06T20:00:00Z',
      status: 'pending',
      supplier: 'Поставщик ООО',
      unitPrice: 1200,
    },
  ];
  return (
    <Layout>
      <Box p={4}>
        <Heading mb={6}>Поточні завдання</Heading>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' }} gap={4}>
          {tasks?.map((task) => (
            <TaskCard
              key={task.id}
              task={{
                ...task,
                deadline: new Date(task.deadline),
              }}
            />
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default StartPage;
