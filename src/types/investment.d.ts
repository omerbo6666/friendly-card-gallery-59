export interface MonthlyData {
  month: number;
  expenses: number;
  investment: number;
  portfolioValue: number;
  profit: number;
}

export interface GenerateMonthlyDataParams {
  investmentPercentageOverride?: number;
  investmentTrack?: string;
}

export type GenerateMonthlyDataFunction = (params?: GenerateMonthlyDataParams) => MonthlyData[];
