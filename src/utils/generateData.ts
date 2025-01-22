import { Person, MonthlyData } from '@/types/investment';

export const generatePeopleData = (): Person[] => {
  const people: Person[] = [];
  
  for (let i = 0; i < 100; i++) {
    const monthlyExpenses = Math.floor(Math.random() * (10000 - 4000) + 4000);
    const investmentPercent = +(Math.random() * (0.20 - 0.03) + 0.03).toFixed(2);
    const annualReturn = +(Math.random() * (0.11 - 0.07) + 0.07).toFixed(2);
    const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
    
    let portfolio = 0;
    const monthlyDeposit = monthlyExpenses * investmentPercent;
    const monthlyData: MonthlyData[] = [];
    let totalExpenses = 0;
    let totalDeposits = 0;
    
    for (let month = 1; month <= 60; month++) {
      totalExpenses += monthlyExpenses;
      totalDeposits += monthlyDeposit;
      portfolio = (portfolio * (1 + monthlyReturn)) + monthlyDeposit;
      
      monthlyData.push({
        month,
        totalExpenses,
        totalDeposits,
        portfolioValue: +portfolio.toFixed(2),
        returns: +(portfolio - totalDeposits).toFixed(2)
      });
    }
    
    people.push({
      id: i + 1,
      monthlyExpenses,
      investmentPercent,
      annualReturn,
      totalExpenses,
      totalDeposits,
      finalPortfolioValue: +portfolio.toFixed(2),
      profit: +(portfolio - totalDeposits).toFixed(2),
      monthlyData,
      roi: +((portfolio - totalDeposits) / totalDeposits * 100).toFixed(2)
    });
  }
  
  return people;
};