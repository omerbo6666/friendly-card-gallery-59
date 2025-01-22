export interface MonthlyData {
  month: number;
  totalExpenses: number;
  totalDeposits: number;
  portfolioValue: number;
}

export interface Person {
  id: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  investmentPercent: number;
  annualReturn: number;
  totalExpenses: number;
  totalDeposits: number;
  finalPortfolioValue: number;
  profit: number;
  monthlyData: MonthlyData[];
  roi: number;
  profession: string;
  ageRange: string;
  savingsRate: number;
}

export interface AggregateStats {
  totalPortfolio: number;
  totalDeposits: number;
  totalProfit: number;
  avgRoi: number;
}