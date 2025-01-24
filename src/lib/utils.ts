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

// Original NASDAQ returns for other investment tracks
const NASDAQ_RETURNS = [
  0.0362, 0.0048, 0.0621, -0.0052, 0.0268, 0.0065, -0.0075, 0.0596, 0.0688, -0.0441,
  0.0179, 0.0612, 0.0102, 0.0552, 0.1070, -0.0278, -0.0581, -0.0217, 0.0405, 0.0659,
  0.0580, 0.0004, 0.0669, -0.0111, 0.1068, -0.0873, 0.0437, 0.0390, -0.1050, -0.0464,
  0.1235, -0.0871, -0.0205, -0.1326, 0.0341, -0.0343, -0.0898, 0.0069, 0.0025, 0.0727,
  -0.0531, 0.0400, 0.0116, 0.0549, -0.0153, 0.0540, 0.0041, 0.0093, 0.0142, 0.0565,
  0.1180, -0.0229, -0.0516, 0.0959, 0.0682, 0.0599, 0.0675, 0.1545, -0.1012, -0.0638,
  0.0199
].reverse();

// S&P 500 returns
const SP500_RETURNS = [
  0.0348, -0.0250, 0.0573, -0.0099, 0.0202, 0.0228, 0.0113, 0.0347, 0.0480, -0.0416,
  0.0310, 0.0517, 0.0159, 0.0442, 0.0892, -0.0220, -0.0487, -0.0177, 0.0311, 0.0647,
  0.0025, 0.0146, 0.0351, -0.0261, 0.0618, -0.0590, 0.0538, 0.0799, -0.0934, -0.0424,
  0.0911, -0.0839, 0.0001, -0.0880, 0.0358, -0.0314, -0.0526, 0.0436, -0.0083, 0.0691,
  -0.0476, 0.0290, 0.0227, 0.0222, 0.0055, 0.0524, 0.0424, 0.0261, -0.0111, 0.0371,
  0.1075, -0.0277, -0.0392, 0.0701, 0.0551, 0.0184, 0.0453, 0.1268, -0.1251, -0.0841,
  -0.0016, 0.0286, 0.0340, 0.0204, 0.0172, -0.0181, 0.0131, 0.0689, -0.0658, 0.0393,
  0.0179, 0.0297, 0.0787
].reverse();

// Russell 2000 returns
export const RUSSELL2000_RETURNS = [
  0.0379, -0.0840, 0.1084, -0.0149, 0.0056, -0.0163, 0.1010, -0.0108, 0.0487,
  -0.0709, 0.0339, 0.0552, -0.0393, 0.1205, 0.0883, -0.0688, -0.0603, -0.0517,
  0.0606, 0.0795, -0.0109, -0.0186, -0.0498, -0.0181, 0.0969, -0.0664, 0.0215,
  0.1094, -0.0973, -0.0218, 0.1038, -0.0837, 0.0000, -0.0995, 0.0108, 0.0097,
  -0.0966, 0.0211, -0.0428, 0.0421, -0.0305, 0.0213, -0.0365, 0.0183, 0.0011,
  0.0207, 0.0088, 0.0614, 0.0500, 0.0852, 0.1829, 0.0204, -0.0347, 0.0550,
  0.0271, 0.0340, 0.0636, 0.1366, -0.2190, -0.0853, -0.0326, 0.0271, 0.0397,
  0.0257, 0.0191, -0.0507, 0.0051, 0.0690, -0.0790, 0.0334, -0.0227, 0.0508,
  0.1119
].reverse();

export const generateMonthlyData = ({ investmentPercentageOverride, investmentTrack }: { investmentPercentageOverride?: number; investmentTrack?: string } = {}): MonthlyData[] => {
  const data: MonthlyData[] = [];
  let portfolioValue = 0;
  let cumulativeProfit = 0;
  let totalInvestment = 0;
  
  // Select returns based on investment track
  let returns;
  switch(investmentTrack) {
    case 'SPY500':
      returns = SP500_RETURNS;
      break;
    case 'RUSSELL2000':
      returns = RUSSELL2000_RETURNS;
      break;
    case 'VTI':
      returns = SP500_RETURNS; // Using SP500 as proxy for VTI
      break;
    default:
      returns = NASDAQ_RETURNS;
  }
  
  for (let month = 0; month < returns.length; month++) {
    const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
    const investmentPercentage = investmentPercentageOverride || (Math.random() * 17 + 3);
    const investment = monthlyExpense * (investmentPercentage / 100);
    
    totalInvestment += investment;
    const monthlyReturn = returns[month];
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
