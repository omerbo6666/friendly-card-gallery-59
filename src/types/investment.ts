export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolioValue: number;
  profit: number;
}

export type InvestmentTrack = 'Nasdaq 100' | 'S&P 500' | 'Tech Sector' | 'Long Term Bonds' | 'Mixed Portfolio';

export interface Client {
  id: number;
  name: string;
  profession: string;
  customProfession?: string;
  monthlyExpenses: number;
  investmentPercentage: string;
  monthlyData: MonthlyData[];
  investmentTrack: InvestmentTrack;
}

export interface Metrics {
  totalInvestment: number;
  portfolioValue: number;
  totalProfit: number;
  latestMonthlyInvestment: number;
  managementFee: number;
  currentValue: number;
}

export interface ClientMetrics {
  totalInvestment: number;
  portfolioValue: number;
  totalProfit: number;
  latestMonthlyInvestment: number;
  managementFee: number;
}

export interface AggregateMetrics {
  totalValue: number;
  totalInvestment: number;
  totalProfit: number;
  totalClients: number;
}
