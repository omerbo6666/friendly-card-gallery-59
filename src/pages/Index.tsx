import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { CustomTooltip } from '@/components/CustomTooltip';
import { generatePeopleData } from '@/utils/generateData';
import { Person, SortConfig } from '@/types/investment';

const Index = () => {
  const [people] = useState(generatePeopleData());
  const [selectedPerson, setSelectedPerson] = useState<Person>(people[0]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'id', direction: 'ascending' });

  const sortedPeople = React.useMemo(() => {
    const sorted = [...people];
    sorted.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });
    return sorted;
  }, [people, sortConfig]);

  const requestSort = (key: keyof Person) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Investment Portfolio Simulator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Investor</CardTitle>
          </CardHeader>
          <CardContent>
            <select
              className="w-full p-2 border rounded-md bg-background"
              value={selectedPerson.id}
              onChange={(e) => setSelectedPerson(people.find(p => p.id === +e.target.value) || people[0])}
            >
              {people.map(person => (
                <option key={person.id} value={person.id}>
                  Investor {person.id}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Investor Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>Monthly Expenses: ${selectedPerson.monthlyExpenses.toLocaleString()}</p>
              <p>Investment Rate: {(selectedPerson.investmentPercent * 100).toFixed(1)}%</p>
              <p>Annual Return: {(selectedPerson.annualReturn * 100).toFixed(1)}%</p>
              <p>ROI: {selectedPerson.roi}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Investment Growth Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ChartContainer
              className="h-full"
              config={{
                expenses: {
                  theme: { light: '#2196F3', dark: '#42a5f5' }
                },
                deposits: {
                  theme: { light: '#FFA726', dark: '#ffb74d' }
                },
                portfolio: {
                  theme: { light: '#4CAF50', dark: '#66bb6a' }
                }
              }}
            >
              <AreaChart data={selectedPerson.monthlyData}>
                <defs>
                  {['expenses', 'deposits', 'portfolio'].map((key) => (
                    <linearGradient key={key} id={`color${key}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={`var(--color-${key})`} stopOpacity={0.1}/>
                      <stop offset="95%" stopColor={`var(--color-${key})`} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  label={{ value: 'Month', position: 'bottom' }}
                  className="text-sm text-muted-foreground"
                />
                <YAxis 
                  label={{ value: 'Amount ($)', angle: -90, position: 'left' }}
                  className="text-sm text-muted-foreground"
                />
                <ChartTooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="totalExpenses" 
                  name="Total Expenses"
                  stroke="var(--color-expenses)"
                  fill="url(#colorexpenses)"
                />
                <Area 
                  type="monotone" 
                  dataKey="totalDeposits" 
                  name="Total Deposits"
                  stroke="var(--color-deposits)"
                  fill="url(#colordeposits)"
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolioValue" 
                  name="Portfolio Value"
                  stroke="var(--color-portfolio)"
                  fill="url(#colorportfolio)"
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Investors Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {[
                    { key: 'id', label: 'ID' },
                    { key: 'monthlyExpenses', label: 'Monthly Expenses' },
                    { key: 'investmentPercent', label: 'Investment Rate' },
                    { key: 'annualReturn', label: 'Annual Return' },
                    { key: 'totalExpenses', label: 'Total Expenses' },
                    { key: 'totalDeposits', label: 'Total Deposits' },
                    { key: 'finalPortfolioValue', label: 'Final Value' },
                    { key: 'profit', label: 'Profit' },
                    { key: 'roi', label: 'ROI' }
                  ].map(column => (
                    <th 
                      key={column.key}
                      onClick={() => requestSort(column.key as keyof Person)}
                      className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-muted/50"
                    >
                      {column.label}
                      {sortConfig.key === column.key && (
                        <span className="ml-2">
                          {sortConfig.direction === 'ascending' ? '↑' : '↓'}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedPeople.map(person => (
                  <tr 
                    key={person.id}
                    className={`hover:bg-muted/50 cursor-pointer ${
                      selectedPerson.id === person.id ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => setSelectedPerson(person)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{person.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">${person.monthlyExpenses.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{(person.investmentPercent * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{(person.annualReturn * 100).toFixed(1)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">${person.totalExpenses.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">${person.totalDeposits.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">${person.finalPortfolioValue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">${person.profit.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{person.roi}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;