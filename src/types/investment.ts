export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolioValue: number;
  profit: number;
}

export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive';

export interface Client {
  id: number;
  name: string;
  profession: string;
  age: number;
  monthlyExpenses: number;
  investmentPercentage: string;
  monthlyData: MonthlyData[];
  riskProfile: RiskProfile;
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