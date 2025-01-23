import { MonthlyData } from '@/types/investment';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FIRST_NAMES = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
  'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
];

export const generateRandomName = () => {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};

const NASDAQ_RETURNS = [
  0.0362, 0.0048, 0.0621, -0.0052, 0.0268, 0.0065, -0.0075, 0.0596, 0.0688, -0.0441,
  0.0179, 0.0612, 0.0102, 0.0552, 0.1070, -0.0278, -0.0581, -0.0217, 0.0405, 0.0659,
  0.0580, 0.0004, 0.0669, -0.0111, 0.1068, -0.0873, 0.0437, 0.0390, -0.1050, -0.0464,
  0.1235, -0.0871, -0.0205, -0.1326, 0.0341, -0.0343, -0.0898, 0.0069, 0.0025, 0.0727,
  -0.0531, 0.0400, 0.0116, 0.0549, -0.0153, 0.0540, 0.0041, 0.0093, 0.0142, 0.0565,
  0.1180, -0.0229, -0.0516, 0.0959, 0.0682, 0.0599, 0.0675, 0.1545, -0.1012, -0.0638,
  0.0199
].reverse();

export const generateMonthlyData = (investmentPercentageOverride?: number): MonthlyData[] => {
  const data: MonthlyData[] = [];
  let portfolioValue = 0;
  let cumulativeProfit = 0;
  let totalInvestment = 0;
  
  // Using S&P 500 as default return rate (7.7%)
  const annualReturn = 0.077;
  const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
  
  for (let month = 0; month < NASDAQ_RETURNS.length; month++) {
    const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
    const investmentPercentage = investmentPercentageOverride || (Math.random() * 17 + 3);
    const investment = monthlyExpense * (investmentPercentage / 100);
    
    totalInvestment += investment;
    portfolioValue = (portfolioValue + investment) * (1 + monthlyReturn);
    cumulativeProfit = portfolioValue - totalInvestment;
    
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