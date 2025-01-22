import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { CustomTooltip } from '@/components/CustomTooltip';
import { ClientProfile } from '@/components/ClientProfile';
import { generatePeopleData } from '@/utils/generateData';
import { Person, AggregateStats } from '@/types/investment';

// ... keep existing code (imports and type definitions)

export default function InvestmentDashboard() {
  const initialPeople = useMemo(() => generatePeopleData(), []);
  const [people] = useState<Person[]>(initialPeople);
  const [selectedPersonId, setSelectedPersonId] = useState(1);
  const [viewMode, setViewMode] = useState<'all' | 'individual'>('individual');

  const selectedPerson = useMemo(() => 
    people.find(p => p.id === selectedPersonId) || people[0],
    [people, selectedPersonId]
  );

  const aggregateStats = useMemo(() => {
    const data = viewMode === 'all' ? people : [selectedPerson];
    return {
      totalPortfolio: data.reduce((sum, p) => sum + p.finalPortfolioValue, 0),
      totalDeposits: data.reduce((sum, p) => sum + p.totalDeposits, 0),
      totalProfit: data.reduce((sum, p) => sum + p.profit, 0),
      avgRoi: data.reduce((sum, p) => sum + p.roi, 0) / data.length,
      totalManagementFee: data.reduce((sum, p) => sum + p.totalManagementFee, 0),
      professionBreakdown: data.reduce((acc, p) => {
        acc[p.profession] = (acc[p.profession] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      ageBreakdown: data.reduce((acc, p) => {
        acc[p.ageRange] = (acc[p.ageRange] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }, [people, selectedPerson, viewMode]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            Investment Analytics Dashboard
          </h1>
          <select 
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm"
            value={viewMode === 'all' ? 'all' : selectedPersonId}
            onChange={(e) => {
              const value = e.target.value;
              if (value === 'all') {
                setViewMode('all');
              } else {
                setViewMode('individual');
                setSelectedPersonId(Number(value));
              }
            }}
          >
            <option value="all">All Portfolios</option>
            {people.map(p => (
              <option key={p.id} value={p.id}>
                Client {p.id} - {p.profession}
              </option>
            ))}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-purple-600 to-indigo-800">
          <div className="p-4">
            <p className="text-gray-200 text-sm">Total Portfolio</p>
            <p className="text-2xl font-bold mt-2">${aggregateStats.totalPortfolio.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-600 to-indigo-800">
          <div className="p-4">
            <p className="text-gray-200 text-sm">Total Profit</p>
            <p className="text-2xl font-bold mt-2">${aggregateStats.totalProfit.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-600 to-indigo-800">
          <div className="p-4">
            <p className="text-gray-200 text-sm">ROI</p>
            <p className="text-2xl font-bold mt-2">{aggregateStats.avgRoi.toFixed(1)}%</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-purple-600 to-indigo-800">
          <div className="p-4">
            <p className="text-gray-200 text-sm">Active Clients</p>
            <p className="text-2xl font-bold mt-2">{viewMode === 'all' ? people.length : 1}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Portfolio Growth</h3>
            <div className="h-80">
              <ResponsiveContainer>
                <AreaChart data={selectedPerson.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis 
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="portfolioValue" 
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.1}
                    name="Portfolio Value"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalDeposits" 
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.1}
                    name="Total Deposits"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-purple-400">Growth Insights</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400">Total Returns</p>
                  <p className="text-xl font-bold text-indigo-400">
                    ${selectedPerson.profit.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">Management Fees</p>
                  <p className="text-xl font-bold text-indigo-400">
                    ${selectedPerson.totalManagementFee.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Portfolio Composition</h3>
            <div className="h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Deposits', value: selectedPerson.totalDeposits },
                      { name: 'Profit', value: selectedPerson.profit }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    <Cell fill="#8B5CF6" />
                    <Cell fill="#6366F1" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-4 bg-gray-800 rounded-lg">
              <h4 className="text-lg font-semibold mb-2 text-purple-400">Composition Insights</h4>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Deposits</span>
                  <span className="font-bold text-indigo-400">${selectedPerson.totalDeposits.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Investment Returns</span>
                  <span className="font-bold text-indigo-400">${selectedPerson.profit.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Management Fees</span>
                  <span className="font-bold text-indigo-400">${selectedPerson.totalManagementFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Net Portfolio Value</span>
                  <span className="font-bold text-indigo-400">
                    ${(selectedPerson.finalPortfolioValue - selectedPerson.totalManagementFee).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
