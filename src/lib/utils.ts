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

// NASDAQ returns (most recent first)
const NASDAQ_RETURNS = [
  0.0423, 0.0039, 0.0523, -0.0085, 0.0248, 0.0110, -0.0163, 0.0618, 0.0628, -0.0446,
  0.0117, 0.0529, 0.0185, 0.0551, 0.1067, -0.0208, -0.0507, -0.0162, 0.0381, 0.0649,
  0.0761, 0.0049, 0.0946, -0.0049, 0.1062, -0.0906, 0.0548, 0.0396, -0.1060, -0.0522,
  0.1255, -0.0900, -0.0165, -0.1337, 0.0422, -0.0464, -0.0852, 0.0114, 0.0180, 0.0790,
  -0.0573, 0.0416, 0.0278, 0.0634, -0.0126, 0.0588, 0.0141, -0.0012, 0.0029, 0.0505,
  0.1100, -0.0320, -0.0572, 0.1105, 0.0737, 0.0629, 0.0617, 0.1519, -0.0766, -0.0589
].reverse();

// S&P 500 returns (most recent first)
const SP500_RETURNS = [
  0.0404, -0.0273, 0.0596, -0.0089, 0.0179, 0.0234, 0.0121, 0.0320, 0.0506, -0.0403,
  0.0295, 0.0522, 0.0159, 0.0414, 0.0913, -0.0217, -0.0508, -0.0163, 0.0327, 0.0609,
  0.0046, 0.0160, 0.0331, -0.0251, 0.0629, -0.0619, 0.0556, 0.0813, -0.0962, -0.0408,
  0.0921, -0.0864, 0.0023, -0.0878, 0.0344, -0.0295, -0.0527, 0.0426, -0.0080, 0.0702,
  -0.0497, 0.0298, 0.0244, 0.0191, 0.0066, 0.0529, 0.0420, 0.0278, -0.0102, 0.0326,
  0.1088, -0.0249, -0.0413, 0.0698, 0.0589, 0.0133, 0.0476, 0.1270, -0.1300, -0.0792
].reverse();

// Russell 2000 returns (most recent first)
export const RUSSELL2000_RETURNS = [
  0.0379, -0.0865, 0.1107, -0.0142, 0.0037, -0.0169, 0.1034, -0.0140, 0.0504, -0.0685,
  0.0322, 0.0563, -0.0390, 0.1172, 0.0920, -0.0691, -0.0629, -0.0508, 0.0611, 0.0777,
  -0.0082, -0.0179, -0.0520, -0.0172, 0.0982, -0.0694, 0.0220, 0.1116, -0.1013, -0.0200,
  0.1056, -0.0861, 0.0019, -0.0990, 0.0096, 0.0103, -0.0953, 0.0196, -0.0433, 0.0425,
  -0.0317, 0.0220, -0.0363, 0.0172, 0.0027, 0.0179, 0.0120, 0.0620, 0.0485, 0.0831,
  0.1824, 0.0220, -0.0363, 0.0548, 0.0292, 0.0308, 0.0659, 0.1385, -0.2178, -0.0885
].reverse();

// Schwab Total Stock Market Index returns (most recent first)
export const SWTSX_RETURNS = [
  0.0201, 0.0313, -0.0200, -0.0027, 0.0059, -0.0224, -0.0205, 0.0093, 0.0104, 0.0221,
  -0.0211, 0.0508, -0.0115, -0.0114, 0.0098, 0.0119, 0.0023, 0.0060, 0.0152, 0.0408,
  -0.0436, 0.0024, 0.0167, 0.0391, -0.0004, -0.0249, -0.0047, -0.0167, 0.0127, 0.0167,
  0.0007, 0.0066, 0.0137, 0.0099, -0.0056, -0.0013, 0.0161, 0.0182, 0.0064, 0.0271,
  -0.0306, -0.0168, -0.0108, 0.0059, 0.0230, -0.0031, -0.0017, 0.0116, 0.0143, -0.0019,
  0.0153, 0.0125, 0.0109, 0.0105, 0.0174, -0.0178, 0.0028, 0.0092, 0.0289, -0.0116
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
    case 'SWTSX':
      returns = SWTSX_RETURNS;
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
