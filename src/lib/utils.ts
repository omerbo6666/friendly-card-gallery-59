import { MonthlyData, InvestmentAllocation } from '@/types/investment';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { startOfMonth, addMonths, isBefore } from 'date-fns';

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

export const generateMonthlyData = ({ 
  investmentPercentageOverride, 
  allocations = [],
  startDate = new Date()
}: { 
  investmentPercentageOverride?: number; 
  allocations?: InvestmentAllocation[];
  startDate?: Date;
} = {}): MonthlyData[] => {
  const data: MonthlyData[] = [];
  let portfolioValue = 0;
  let cumulativeProfit = 0;
  let totalInvestment = 0;
  
  const startMonth = startOfMonth(startDate);
  let currentMonth = startMonth;
  const today = new Date();
  
  let monthCounter = 1;
  
  while (isBefore(currentMonth, today)) {
    const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
    const investmentPercentage = investmentPercentageOverride || (Math.random() * 17 + 3);
    const totalMonthlyInvestment = monthlyExpense * (investmentPercentage / 100);
    
    // Calculate weighted returns based on allocations
    let monthlyReturn = 0;
    allocations.forEach(allocation => {
      const trackReturn = getTrackReturn(allocation.track_id, monthCounter);
      monthlyReturn += (trackReturn * (allocation.percentage / 100));
    });
    
    totalInvestment += totalMonthlyInvestment;
    portfolioValue = (portfolioValue + totalMonthlyInvestment) * (1 + monthlyReturn);
    cumulativeProfit = portfolioValue - totalInvestment;
    
    data.push({
      month: monthCounter,
      expenses: monthlyExpense,
      investment: totalMonthlyInvestment,
      portfolioValue,
      profit: cumulativeProfit
    });
    
    currentMonth = addMonths(currentMonth, 1);
    monthCounter++;
  }
  
  return data;
};

function getTrackReturn(trackId: string, month: number): number {
  // Use the appropriate returns array based on the track
  const returns = trackId === 'SPY500' ? SP500_RETURNS :
                 trackId === 'RUSSELL2000' ? RUSSELL2000_RETURNS :
                 NASDAQ_RETURNS;
                 
  // Ensure we don't go out of bounds
  const index = month % returns.length;
  return returns[index];
}

// Updated NASDAQ returns (most recent first)
const NASDAQ_RETURNS = [
  0.0423, 0.0039, 0.0523, -0.0085, 0.0248, 0.0110, -0.0163, 0.0618, 0.0628, -0.0446,
  0.0117, 0.0529, 0.0185, 0.0551, 0.1067, -0.0208, -0.0507, -0.0162, 0.0381, 0.0649,
  0.0761, 0.0049, 0.0946, -0.0049, 0.1062, -0.0906, 0.0548, 0.0396, -0.1060, -0.0522,
  0.1255, -0.0900, -0.0165, -0.1337, 0.0422, -0.0464, -0.0852, 0.0114, 0.0180, 0.0790,
  -0.0573, 0.0416, 0.0278, 0.0634, -0.0126, 0.0588, 0.0141, -0.0012, 0.0029, 0.0505,
  0.1100, -0.0320, -0.0572, 0.1105, 0.0737, 0.0629, 0.0617, 0.1519, -0.0766, -0.0589,
  0.0296, 0.0392, 0.0396, 0.0431, 0.0076, -0.0201, 0.0232, 0.0762, -0.0840, 0.0546,
  0.0396, 0.0276, 0.0911, -0.0891, -0.0026, -0.0866, -0.0035, 0.0584, 0.0272, 0.0105,
  0.0548, 0.0037, -0.0399, -0.0138, 0.0865, 0.0048, 0.0187, 0.0450, -0.0016, 0.0184,
  0.0413, -0.0245, 0.0368, 0.0271, 0.0199, 0.0417, 0.0520, 0.0110, 0.0020, -0.0153,
  0.0219, 0.0086, 0.0707, -0.0235, 0.0421, -0.0317, 0.0673, -0.0182, -0.0684, -0.0153,
  0.0034, 0.1119, -0.0219, -0.0685, 0.0437, -0.0247, 0.0213, 0.0186, -0.0241, 0.0704,
  -0.0207, -0.0234, 0.0432, 0.0269, -0.0081, 0.0488, 0.0112, 0.0301, 0.0432, -0.0038,
  -0.0272, 0.0495, -0.0195, 0.0299, 0.0326, 0.0496, 0.0470, -0.0053, 0.0621, -0.0242,
  0.0327, 0.0244, 0.0293, 0.0026, 0.0265, -0.0063, 0.0113, -0.0540, 0.0097, 0.0491,
  0.0102, 0.0360, -0.0730, -0.0115, 0.0504, 0.0629, 0.0835, -0.0076, -0.0275, 0.1033,
  -0.0454, -0.0515, 0.0162, -0.0200, -0.0131, 0.0278, -0.0051, 0.0303, 0.0289, 0.0475,
  -0.0034, 0.0633, 0.1305, -0.0518, 0.0718, -0.0611, -0.0741, 0.0216, 0.0768, 0.0446,
  -0.0641, 0.0526, 0.0602, -0.0302, 0.0577, 0.0136, 0.0854, 0.0290, 0.0296, 0.1272,
  0.1074, -0.0536, -0.0259, 0.0218, -0.1117, -0.1630, -0.1484, 0.0126, 0.0066, -0.0962,
  0.0599, 0.0762, 0.0210, -0.0522, -0.1168, -0.0020, -0.0669, 0.0707, 0.0515, 0.0293,
  -0.0011, 0.0031, 0.0324, 0.0538, 0.0061, -0.0171, 0.0201, -0.0192, 0.0339, 0.0474,
  0.0471, 0.0466, -0.0418, -0.0028, -0.0712, -0.0017, 0.0198, -0.0235, 0.0398, -0.0164,
  0.0591, -0.0140, 0.0126, -0.0146, 0.0747, -0.0318, 0.0858, -0.0416, -0.0189, -0.0057,
  -0.0626, 0.0316, 0.0570, 0.0524, 0.0322, -0.0226, -0.0766, 0.0344, 0.0463, -0.0258,
  -0.0217, -0.0152, 0.0171, 0.0307, 0.0055, 0.0864, -0.0280, 0.0503, 0.0626, 0.0032,
  0.0830, 0.0858, 0.0088, 0.0272, -0.0013, -0.1180, 0.1279, 0.1886, -0.1166, -0.0205,
  -0.0849, -0.1299, -0.0538, -0.1210, 0.0689, -0.1232, -0.0170, -0.0119, 0.1695, 0.1681,
  -0.2050, -0.1271, -0.0801, 0.0168, -0.0298, 0.1792, -0.1756, -0.2640, 0.1073, -0.0658,
  -0.2363, -0.0807, -0.1243, 0.1297, -0.0410, 0.1323, -0.1190, -0.1420, 0.0307, 0.1952,
  -0.0372
].reverse();

const SP500_RETURNS = [
  0.0404, -0.0273, 0.0596, -0.0089, 0.0179, 0.0234, 0.0121, 0.0320, 0.0506, -0.0403,
  0.0295, 0.0522, 0.0159, 0.0414, 0.0913, -0.0217, -0.0508, -0.0163, 0.0327, 0.0609,
  0.0046, 0.0160, 0.0331, -0.0251, 0.0629, -0.0619, 0.0556, 0.0813, -0.0962, -0.0408,
  0.0921, -0.0864, 0.0023, -0.0878, 0.0344, -0.0295, -0.0527, 0.0426, -0.0080, 0.0702,
  -0.0497, 0.0298, 0.0244, 0.0191, 0.0066, 0.0529, 0.0420, 0.0278, -0.0102, 0.0326,
  0.1088, -0.0249, -0.0413, 0.0698, 0.0589, 0.0133, 0.0476, 0.1270, -0.1300, -0.0792
].reverse();

export const RUSSELL2000_RETURNS = [
  0.0379, -0.0865, 0.1107, -0.0142, 0.0037, -0.0169, 0.1034, -0.0140, 0.0504, -0.0685,
  0.0322, 0.0563, -0.0390, 0.1172, 0.0920, -0.0691, -0.0629, -0.0508, 0.0611, 0.0777,
  -0.0082, -0.0179, -0.0520, -0.0172, 0.0982, -0.0694, 0.0220, 0.1116, -0.1013, -0.0200,
  0.1056, -0.0861, 0.0019, -0.0990, 0.0096, 0.0103, -0.0953, 0.0196, -0.0433, 0.0425,
  -0.0317, 0.0220, -0.0363, 0.0172, 0.0027, 0.0179, 0.0120, 0.0620, 0.0485, 0.0831,
  0.1824, 0.0220, -0.0363, 0.0548, 0.0292, 0.0308, 0.0659, 0.1385, -0.2178, -0.0885
].reverse();
