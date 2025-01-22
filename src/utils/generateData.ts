import { Person, MonthlyData } from '@/types/investment';

export const generatePeopleData = (): Person[] => {
  const people: Person[] = [];
  const professions = ['Engineer', 'Doctor', 'Lawyer', 'Teacher', 'Manager', 'Accountant'];
  const ageRanges = ['25-35', '36-45', '46-55', '56-65'];
  
  for (let i = 0; i < 100; i++) {
    const monthlyExpenses = Math.floor(Math.random() * (20000 - 5000) + 5000);
    const monthlyIncome = monthlyExpenses * (Math.random() * (3 - 1.5) + 1.5);
    const investmentPercent = +(Math.random() * (0.20 - 0.03) + 0.03).toFixed(2);
    const annualReturn = +(Math.random() * (0.11 - 0.07) + 0.07).toFixed(2);
    const monthlyReturn = Math.pow(1 + annualReturn, 1/12) - 1;
    const profession = professions[Math.floor(Math.random() * professions.length)];
    const ageRange = ageRanges[Math.floor(Math.random() * ageRanges.length)];
    
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
        portfolioValue: +portfolio.toFixed(2)
      });
    }
    
    people.push({
      id: i + 1,
      monthlyIncome: +monthlyIncome.toFixed(2),
      monthlyExpenses,
      investmentPercent,
      annualReturn,
      totalExpenses,
      totalDeposits,
      finalPortfolioValue: +portfolio.toFixed(2),
      profit: +(portfolio - totalDeposits).toFixed(2),
      monthlyData,
      roi: +((portfolio - totalDeposits) / totalDeposits * 100).toFixed(2),
      profession,
      ageRange,
      savingsRate: +((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(2)
    });
  }
  
  return people;
};