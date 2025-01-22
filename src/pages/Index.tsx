import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { CustomTooltip } from '@/components/CustomTooltip';
import { ClientProfile } from '@/components/ClientProfile';
import { generatePeopleData } from '@/utils/generateData';
import { COLORS } from '@/constants/colors';
import { Person, AggregateStats } from '@/types/investment';

export default function InvestmentDashboard() {
  const initialPeople = useMemo(() => generatePeopleData(), []);
  const [people] = useState<Person[]>(initialPeople);
  const [selectedPersonId, setSelectedPersonId] = useState(1);
  const [viewMode, setViewMode] = useState<'all' | 'individual'>('individual');

  const selectedPerson = useMemo(() => 
    people.find(p => p.id === selectedPersonId) || people[0],
    [people, selectedPersonId]
  );

  const aggregateStats = useMemo<AggregateStats>(() => {
    const data = viewMode === 'all' ? people : [selectedPerson];
    return {
      totalPortfolio: data.reduce((sum, p) => sum + p.finalPortfolioValue, 0),
      totalDeposits: data.reduce((sum, p) => sum + p.totalDeposits, 0),
      totalProfit: data.reduce((sum, p) => sum + p.profit, 0),
      avgRoi: data.reduce((sum, p) => sum + p.roi, 0) / data.length
    };
  }, [people, selectedPerson, viewMode]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
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
        {/* Stats Cards */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800">
          <div className="p-4">
            <p className="text-gray-200 text-sm">Total Portfolio</p>
            <p className="text-2xl font-bold mt-2">${aggregateStats.totalPortfolio.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-600 to-emerald-800">
          <div className="p-4">
            <p className="text-gray-200 text-sm">Total Profit</p>
            <p className="text-2xl font-bold mt-2">${aggregateStats.totalProfit.toLocaleString()}</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-amber-600 to-amber-800">
          <div className="p-4">
            <p className="text-gray-200 text-sm">ROI</p>
            <p className="text-2xl font-bold mt-2">{aggregateStats.avgRoi.toFixed(1)}%</p>
          </div>
        </Card>
        <Card className="bg-gradient-to-br from-cyan-600 to-cyan-800">
          <div className="p-4">
            <p className="text-gray-200 text-sm">Active Clients</p>
            <p className="text-2xl font-bold mt-2">{viewMode === 'all' ? people.length : 1}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Charts */}
        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Portfolio Growth</h3>
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
                    stroke={COLORS.primary.main}
                    fill={COLORS.primary.main}
                    fillOpacity={0.1}
                    name="Portfolio Value"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="totalDeposits" 
                    stroke={COLORS.success.main}
                    fill={COLORS.success.main}
                    fillOpacity={0.1}
                    name="Total Deposits"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Portfolio Composition</h3>
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
                    <Cell fill={COLORS.primary.main} />
                    <Cell fill={COLORS.success.main} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {viewMode === 'individual' && (
          <ClientProfile person={selectedPerson} />
        )}
      </div>
    </div>
  );
}