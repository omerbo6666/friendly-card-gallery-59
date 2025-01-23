import { Client, FundMetrics, Profession } from '@/types/dashboard';

const PROFESSIONS: Profession[] = [
  { name: 'Doctor', avgIncome: [25000, 45000] },
  { name: 'Lawyer', avgIncome: [20000, 40000] },
  { name: 'Engineer', avgIncome: [18000, 35000] },
  { name: 'Entrepreneur', avgIncome: [15000, 50000] },
  { name: 'Executive', avgIncome: [30000, 60000] }
];

export const generateClients = (): Client[] => {
  return Array.from({ length: 100 }, (_, i) => {
    const profession = PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)];
    const monthlyIncome = Math.floor(Math.random() * 
      (profession.avgIncome[1] - profession.avgIncome[0]) + profession.avgIncome[0]);
    const monthlyExpenses = monthlyIncome * (0.4 + Math.random() * 0.2);
    const investmentPercentage = (Math.random() * 17 + 3).toFixed(1);
    const annualRate = (Math.random() * 4 + 7).toFixed(1);

    const monthlyData = calculateMonthlyData(monthlyExpenses, investmentPercentage, annualRate);
    const managementFees = calculateManagementFees(monthlyData);

    return {
      id: i + 1,
      name: `Client ${i + 1}`,
      profession: profession.name,
      monthlyIncome,
      monthlyExpenses,
      investmentPercentage,
      annualRate,
      riskProfile: ['Conservative', 'Moderate', 'Aggressive'][Math.floor(Math.random() * 3)] as Client['riskProfile'],
      monthlyData,
      managementFees,
      age: Math.floor(Math.random() * 35) + 25
    };
  });
};

const calculateMonthlyData = (expenses: number, percentage: string, rate: string) => {
  const months = 60;
  const monthlyRate = (Math.pow(1 + parseFloat(rate)/100, 1/12) - 1);
  const monthlyInvestment = expenses * (parseFloat(percentage)/100);
  
  let data = [];
  let portfolio = 0;
  let totalExpenses = 0;
  let totalInvestment = 0;
  let cumulativeProfit = 0;

  for (let i = 0; i < months; i++) {
    const monthlyProfit = portfolio * monthlyRate;
    portfolio = portfolio * (1 + monthlyRate) + monthlyInvestment;
    totalExpenses += expenses;
    totalInvestment += monthlyInvestment;
    cumulativeProfit += monthlyProfit;
    
    data.push({
      month: i + 1,
      expenses: totalExpenses,
      investment: totalInvestment,
      portfolio,
      profit: portfolio - totalInvestment,
      cumulativeProfit
    });
  }
  return data;
};

const calculateManagementFees = (monthlyData: any[]) => {
  return monthlyData.map(data => ({
    month: data.month,
    fee: data.portfolio * 0.005 / 12
  }));
};

export const calculateFundMetrics = (clients: Client[]): FundMetrics => {
  const metrics: FundMetrics = {
    totalPortfolio: 0,
    totalProfit: 0,
    totalFees: 0,
    avgROI: 0,
    professionStats: {},
    monthlyPerformance: Array(60).fill(0).map(() => ({
      portfolio: 0,
      profit: 0,
      investment: 0
    }))
  };

  clients.forEach(client => {
    if (!metrics.professionStats[client.profession]) {
      metrics.professionStats[client.profession] = {
        count: 0,
        totalPortfolio: 0,
        totalProfit: 0,
        avgIncome: 0,
        avgExpenses: 0,
        avgInvestmentPct: 0
      };
    }

    const stats = metrics.professionStats[client.profession];
    stats.count++;
    stats.totalPortfolio += client.monthlyData[59].portfolio;
    stats.totalProfit += client.monthlyData[59].profit;
    stats.avgIncome += client.monthlyIncome;
    stats.avgExpenses += client.monthlyExpenses;
    stats.avgInvestmentPct += parseFloat(client.investmentPercentage);

    metrics.totalPortfolio += client.monthlyData[59].portfolio;
    metrics.totalProfit += client.monthlyData[59].profit;
    metrics.totalFees += client.managementFees[59].fee;

    client.monthlyData.forEach((month, idx) => {
      metrics.monthlyPerformance[idx].portfolio += month.portfolio;
      metrics.monthlyPerformance[idx].profit += month.profit;
      metrics.monthlyPerformance[idx].investment += month.investment;
    });
  });

  Object.keys(metrics.professionStats).forEach(profession => {
    const stats = metrics.professionStats[profession];
    const count = stats.count;
    stats.avgIncome /= count;
    stats.avgExpenses /= count;
    stats.avgInvestmentPct /= count;
  });

  metrics.avgROI = +(metrics.totalProfit / metrics.totalPortfolio * 100).toFixed(2);
  return metrics;
};