export function groupByStatus(tasks: any[]) {
  return tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {});
}

export function sumTotal(sales: any[]) {
  return sales.reduce((total, sale) => {
    return (
      total + sale.order_items.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0)
    );
  }, 0);
}

export interface Sale {
  created_at: string | Date;
  order_items: Array<{
    price: number;
    quantity: number;
  }>;
}

export function groupByDate(sales: Partial<Sale>[]) {
  const result: Record<string, number> = {};

  for (const sale of sales) {
    if (!sale?.created_at || !Array.isArray(sale.order_items)) continue;

    try {
      const dateObj = new Date(sale.created_at);
      const date = dateObj.toISOString().split('T')[0];

      result[date] =
        (result[date] || 0) +
        sale.order_items.reduce(
          (sum: number, item) => sum + (item.price || 0) * (item.quantity || 0),
          0,
        );
    } catch (error) {
      console.error('Error processing sale:', error);
    }
  }

  return Object.entries(result).map(([date, total]) => ({
    date,
    total: Number(total.toFixed(2)),
  }));
}
