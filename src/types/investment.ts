export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolioValue: number;
  profit: number;
}

export type InvestmentTrack = 'SPY500' | 'NASDAQ100' | 'RUSSELL2000';

export interface InvestmentAllocation {
  trackId: InvestmentTrack;
  percentage: number;
}

export interface Client {
  id: number;
  name: string;
  profession: string;
  customProfession?: string;
  investmentTrack?: InvestmentTrack;
  monthlyData: MonthlyData[];
  monthlyExpenses: number;
  investmentPercentage: string;
  startDate: Date;
  allocations?: InvestmentAllocation[];
}

export interface ClientMetrics {
  totalInvestment: number;
  portfolioValue: number;
  totalProfit: number;
  latestMonthlyInvestment: number;
  managementFee: number;
}

export interface Metrics {
  currentValue: number;
  latestMonthlyInvestment: number;
}

export interface AggregateMetrics {
  totalValue: number;
  totalInvestment: number;
  totalProfit: number;
  totalClients: number;
}