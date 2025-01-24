export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolioValue: number;
  profit: number;
}

export type InvestmentTrack = 'SPY500' | 'NASDAQ100' | 'RUSSELL2000';

export interface InvestmentAllocation {
  track_id: string;
  percentage: number;
}

export interface Client {
  id: string;
  name: string;
  profession: string;
  investment_track?: string;
  monthly_expenses: number;
  investment_percentage: number;
  start_date: string;
  created_at?: string;
  updated_at?: string;
  client_allocations?: InvestmentAllocation[];
  monthly_performance?: {
    month: number;
    expenses: number;
    investment: number;
    portfolio_value: number;
    profit: number;
  }[];
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