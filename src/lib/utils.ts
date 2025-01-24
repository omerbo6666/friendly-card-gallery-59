import { MonthlyData } from '@/types/investment';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getReturnsForTrack } from './investmentReturns';
import { validateInvestmentTrack } from '@/config/investmentTracks';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateMonthlyData = ({ investmentPercentageOverride, investmentTrack }: { investmentPercentageOverride?: number; investmentTrack?: string } = {}): MonthlyData[] => {
  const data: MonthlyData[] = [];
  let portfolioValue = 0;
  let cumulativeProfit = 0;
  let totalInvestment = 0;
  
  // Get returns based on investment track
  const returns = getReturnsForTrack(investmentTrack || 'SWTSX');
  console.log(`Generating monthly data for track: ${investmentTrack}`);
  
  for (let month = 0; month < returns.length; month++) {
    const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
    const investmentPercentage = investmentPercentageOverride || (Math.random() * 17 + 3);
    const investment = monthlyExpense * (investmentPercentage / 100);
    
    totalInvestment += investment;
    const monthlyReturn = returns[month];
    portfolioValue = (portfolioValue + investment) * (1 + monthlyReturn);
    cumulativeProfit = portfolioValue - totalInvestment;
    
    console.log(`Month ${month + 1}: Return: ${monthlyReturn}, Portfolio Value: ${portfolioValue}`);
    
    data.push({
      month: month + 1,
      expenses: monthlyExpense,
      investment,
      portfolioValue,
      profit: cumulativeProfit
    });
  }
  return data;
};