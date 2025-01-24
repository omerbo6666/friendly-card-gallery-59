import { MonthlyData } from '@/types/investment';

export interface AggregatedChartData {
  date: string;
  totalManagedFunds: number;
  cumulativeInvestment: number;
  cumulativeProfit: number;
  managementFees: number;
}

export const aggregateMonthlyData = (monthlyData: MonthlyData[]): AggregatedChartData[] => {
  const aggregatedData: AggregatedChartData[] = [];
  let cumulativeInvestment = 0;
  let cumulativeProfit = 0;

  monthlyData.forEach((data) => {
    cumulativeInvestment += data.investment || 0;
    cumulativeProfit += data.profit || 0;
    const managementFees = cumulativeInvestment * 0.005;
    const totalManagedFunds = cumulativeInvestment + cumulativeProfit;

    aggregatedData.push({
      date: `Month ${data.month}`,
      cumulativeInvestment,
      cumulativeProfit,
      totalManagedFunds,
      managementFees,
    });
  });

  return aggregatedData;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};