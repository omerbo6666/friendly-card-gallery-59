export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolioValue: number;
  profit: number;
}

export interface Client {
  id: number;
  name: string;
  profession: string;
  age: number;
  monthlyExpenses: number;
  investmentPercentage: string;
  monthlyData: MonthlyData[];
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
}

export interface Metrics {
  totalExpenses: number;
  totalInvestment: number;
  currentValue: number;
  totalProfit: number;
  managementFee: number;
}

export interface AggregateMetrics {
  totalValue: number;
  totalInvestment: number;
  totalProfit: number;
  totalFees: number;
}

export interface Person {
  id: number;
  monthlyExpenses: number;
  investmentPercent: number;
  annualReturn: number;
  totalExpenses: number;
  totalDeposits: number;
  finalPortfolioValue: number;
  profit: number;
  monthlyData: MonthlyData[];
  roi: number;
}

export type SortConfig = {
  key: keyof Person;
  direction: 'ascending' | 'descending';
};