export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolioValue: number;
  monthlyProfit: number;
  totalInvestment: number;
  profit: number;
}

export type RiskProfile = 'Conservative' | 'Moderate' | 'Aggressive';

export interface Client {
  id: number;
  name: string;
  profession: string;
  riskProfile: RiskProfile;
  monthlyData: MonthlyData[];
}

export interface MarketData {
  date: string;
  change: number;
}

export interface ClientMetrics {
  monthlyInvestment: number;
  portfolioValue: number;
  totalProfit: number;
}

export interface AggregateMetrics {
  totalPortfolioValue: number;
  totalInvestment: number;
  totalProfit: number;
  totalClients: number;
}