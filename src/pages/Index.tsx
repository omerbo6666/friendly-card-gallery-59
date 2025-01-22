import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChartContainer, ChartTooltip } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { CustomTooltip } from '@/components/CustomTooltip';
import { generatePeopleData } from '@/utils/generateData';
import { Person, AggregateStats } from '@/types/investment';

export default function InvestmentDashboard() {
  const [people] = useState(generatePeopleData());
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'individual'>('all');

  const aggregateStats = useMemo<AggregateStats>(() => {
    const data = selectedPerson ? [selectedPerson] : people;
    return {
      totalPortfolio: data.reduce((sum, p) => sum + p.finalPortfolioValue, 0),
      totalDeposits: data.reduce((sum, p) => sum + p.totalDeposits, 0),
      totalExpenses: data.reduce((sum, p) => sum + p.totalExpenses, 0),
      totalProfit: data.reduce((sum, p) => sum + p.profit, 0),
      avgRoi: data.reduce((sum, p) => sum + p.roi, 0) / data.length,
      professionStats: data.reduce((acc, p) => {
        acc[p.profession] = (acc[p.profession] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [people, selectedPerson]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Investment Portfolio Analytics</h1>
        <select 
          className="w-64 p-2 border rounded-md bg-background"
          onChange={(e) => {
            if (e.target.value === 'all') {
              setSelectedPerson(null);
              setViewMode('all');
            } else {
              setSelectedPerson(people.find(p => p.id === +e.target.value) || null);
              setViewMode('individual');
            }
          }}
          value={selectedPerson?.id || 'all'}
        >
          <option value="all">All Clients</option>
          {people.map(person => (
            <option key={person.id} value={person.id}>
              Client {person.id} - {person.profession}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/10">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Total Portfolio Value</p>
            <p className="text-2xl font-bold">${aggregateStats.totalPortfolio.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Total Deposits</p>
            <p className="text-2xl font-bold">${aggregateStats.totalDeposits.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Total Profit</p>
            <p className="text-2xl font-bold">${aggregateStats.totalProfit.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="bg-primary/10">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Average ROI</p>
            <p className="text-2xl font-bold">{aggregateStats.avgRoi.toFixed(2)}%</p>
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
              <AreaChart data={selectedPerson ? selectedPerson.monthlyData : people[0].monthlyData}>
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

      {selectedPerson && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Profession</p>
                    <p className="text-xl">{selectedPerson.profession}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Age Range</p>
                    <p className="text-xl">{selectedPerson.ageRange}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Income</p>
                    <p className="text-xl">${selectedPerson.monthlyIncome.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Savings Rate</p>
                    <p className="text-xl">{selectedPerson.savingsRate}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Investment Rate</p>
                    <p className="text-xl">{(selectedPerson.investmentPercent * 100).toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Annual Return</p>
                    <p className="text-xl">{(selectedPerson.annualReturn * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-muted-foreground">Total Portfolio Growth</p>
                  <p className="text-2xl font-bold text-primary">
                    {((selectedPerson.finalPortfolioValue / selectedPerson.totalDeposits - 1) * 100).toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Monthly Investment</p>
                  <p className="text-2xl font-bold">
                    ${(selectedPerson.monthlyExpenses * selectedPerson.investmentPercent).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Profit</p>
                  <p className="text-2xl font-bold text-primary">
                    ${selectedPerson.profit.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}