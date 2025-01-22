export interface MonthlyData {
  month: number;
  totalExpenses: number;
  totalDeposits: number;
  portfolioValue: number;
  returns: number;
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