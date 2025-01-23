export interface Profession {
  name: string;
  avgIncome: [number, number];
}

export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolio: number;
  profit: number;
  cumulativeProfit: number;
}

export interface ManagementFee {
  month: number;
  fee: number;
}

export interface Client {
  id: number;
  name: string;
  profession: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  investmentPercentage: string;
  annualRate: string;
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
  monthlyData: MonthlyData[];
  managementFees: ManagementFee[];
  age: number;
}

export interface ProfessionStats {
  count: number;
  totalPortfolio: number;
  totalProfit: number;
  avgIncome: number;
  avgExpenses: number;
  avgInvestmentPct: number;
}

export interface FundMetrics {
  totalPortfolio: number;
  totalProfit: number;
  totalFees: number;
  avgROI: number;
  professionStats: Record<string, ProfessionStats>;
  monthlyPerformance: {
    portfolio: number;
    profit: number;
    investment: number;
  }[];
}