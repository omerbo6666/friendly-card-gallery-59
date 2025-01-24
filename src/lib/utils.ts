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

// Schwab Total Stock Market Index returns
export const SWTSX_RETURNS = [
  0.0201, 0.0313, -0.0200, -0.0027, 0.0059, -0.0224, -0.0205, 0.0093, 0.0104, 0.0221,
  -0.0211, 0.0508, -0.0115, -0.0114, 0.0098, 0.0119, 0.0023, 0.0060, 0.0152, 0.0408,
  -0.0436, 0.0024, 0.0167, 0.0391, -0.0004, -0.0249, -0.0047, -0.0167, 0.0127, 0.0167,
  0.0007, 0.0066, 0.0137, 0.0099, -0.0056, -0.0013, 0.0161, 0.0182, 0.0064, 0.0271,
  -0.0306, -0.0168, -0.0108, 0.0059, 0.0230, -0.0031, -0.0017, 0.0116, 0.0143, -0.0019,
  0.0153, 0.0125, 0.0109, 0.0105, 0.0174, -0.0178, 0.0028, 0.0092, 0.0289, -0.0116,
  0.0121, 0.0104, 0.0261, 0.0096, 0.0609, -0.0259, -0.0240, 0.0026, 0.0023, -0.0052,
  -0.0302, -0.0018, -0.0144, 0.0278, 0.0074, -0.0218, -0.0048, -0.0217, 0.0099, 0.0075,
  0.0264, -0.0108, 0.0257, -0.0160, 0.0254, 0.0052, 0.0209, 0.0034, 0.0173, -0.0027,
  -0.0075, 0.0060, -0.0003, 0.0091, -0.0047, 0.0371, 0.0128, 0.0100, -0.0510, 0.0201,
  -0.0270, 0.0007, -0.0138, 0.0193, 0.0258, -0.0060, 0.0310, 0.0149, -0.0006, -0.0023,
  -0.0201, -0.0507, 0.0125, 0.0152, -0.0088, 0.0601, -0.0329, 0.0417, 0.0458, -0.0172,
  0.0170, -0.0260, -0.0502, -0.0475, 0.0385, -0.0342, -0.0384, -0.0148, 0.0349, 0.0068,
  0.0422, 0.0277, -0.0105, 0.0206, -0.0228, 0.0650, -0.0597, -0.0504, -0.0108, 0.0657,
  -0.0281, -0.0237, -0.0056, -0.0332, -0.0294, -0.0173, -0.0177, 0.0024, 0.0152, 0.0634,
  -0.0276, -0.0156, 0.0096, -0.0162, -0.0136, 0.0178, 0.0050, -0.0598, -0.0044, -0.0224
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
