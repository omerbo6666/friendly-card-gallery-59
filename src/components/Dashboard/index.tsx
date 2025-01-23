import React, { useState, useEffect } from 'react';
import { Search, Users, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MetricCard } from './MetricCard';
import { ClientCard } from './ClientCard';
import { Client, MonthlyData, Metrics, AggregateMetrics } from '@/types/investment';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const PROFESSIONS = ['Software Engineer', 'Doctor', 'Lawyer', 'Business Owner', 'Teacher'];
const RISK_PROFILES = ['Conservative', 'Moderate', 'Aggressive'] as const;

export const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'all' | 'individual'>('all');

  useEffect(() => {
    generateInitialData();
  }, []);

  const generateInitialData = () => {
    const generateMonthlyData = (): MonthlyData[] => {
      const data: MonthlyData[] = [];
      let portfolioValue = 0;
      const monthlyReturn = Math.pow(1 + 0.0711, 1/12) - 1;

      for (let month = 1; month <= 60; month++) {
        const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
        const investment = monthlyExpense * 0.1;
        portfolioValue = (portfolioValue + investment) * (1 + monthlyReturn);
        
        data.push({
          month,
          expenses: monthlyExpense,
          investment,
          portfolioValue,
          profit: portfolioValue - (investment * month)
        });
      }
      return data;
    };

    const newClients: Client[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Client ${i + 1}`,
      profession: PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)],
      age: Math.floor(Math.random() * 30) + 25,
      monthlyExpenses: Math.floor(Math.random() * 16000) + 4000,
      investmentPercentage: (Math.random() * 17 + 3).toFixed(1),
      monthlyData: generateMonthlyData(),
      riskProfile: RISK_PROFILES[Math.floor(Math.random() * RISK_PROFILES.length)] as Client['riskProfile']
    }));

    setClients(newClients);
  };

  const calculateMetrics = (client) => {
    const lastMonth = client.monthlyData[client.monthlyData.length - 1];
    return {
      totalExpenses: client.monthlyData.reduce((sum, data) => sum + data.expenses, 0),
      totalInvestment: client.monthlyData.reduce((sum, data) => sum + data.investment, 0),
      currentValue: lastMonth.portfolioValue,
      totalProfit: lastMonth.profit,
      managementFee: client.monthlyData.reduce((sum, data) => sum + data.investment, 0) * 0.005
    };
  };

  const aggregateMetrics: AggregateMetrics = clients.reduce((acc, client) => {
    const metrics = calculateMetrics(client);
    return {
      totalValue: acc.totalValue + metrics.currentValue,
      totalInvestment: acc.totalInvestment + metrics.totalInvestment,
      totalProfit: acc.totalProfit + metrics.totalProfit,
      totalFees: acc.totalFees + metrics.managementFee
    };
  }, { totalValue: 0, totalInvestment: 0, totalProfit: 0, totalFees: 0 });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Investment Dashboard</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search clients..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button 
            variant={view === 'all' ? 'default' : 'outline'}
            onClick={() => {setView('all'); setSelectedClient(null);}}
          >
            All Clients
          </Button>
          <Button 
            variant={view === 'individual' ? 'default' : 'outline'}
            onClick={() => setView('individual')}
          >
            Individual View
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Portfolio Value"
          value={aggregateMetrics.totalValue.toLocaleString('en-IL', { style: 'currency', currency: 'ILS' })}
          icon={Wallet}
          change={8.5}
        />
        <MetricCard
          title="Total Investment"
          value={aggregateMetrics.totalInvestment.toLocaleString('en-IL', { style: 'currency', currency: 'ILS' })}
          icon={TrendingUp}
          change={12.3}
        />
        <MetricCard
          title="Total Profit"
          value={aggregateMetrics.totalProfit.toLocaleString('en-IL', { style: 'currency', currency: 'ILS' })}
          icon={DollarSign}
          change={15.7}
        />
        <MetricCard
          title="Total Clients"
          value={clients.length}
          icon={Users}
          change={5.2}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Portfolio Performance</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={selectedClient ? selectedClient.monthlyData : clients[0]?.monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="portfolioValue" stroke="#4F46E5" name="Portfolio Value" strokeWidth={2} />
              <Line type="monotone" dataKey="investment" stroke="#10B981" name="Monthly Investment" />
              <Line type="monotone" dataKey="profit" stroke="#F59E0B" name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold mb-6">Client Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={PROFESSIONS.map(profession => ({
                  name: profession,
                  value: clients.filter(client => client.profession === profession).length
                }))}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label
              >
                {PROFESSIONS.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Grid */}
      <div className="bg-card p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold mb-6">Client Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.slice(0, 6).map(client => (
            <ClientCard 
              key={client.id} 
              client={client}
              metrics={calculateMetrics(client)}
              onSelect={setSelectedClient}
            />
          ))}
        </div>
      </div>
      
      {/* Selected Client Dialog */}
      <Dialog open={!!selectedClient} onOpenChange={() => setSelectedClient(null)}>
        {selectedClient && (
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedClient.name}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">Client Details</h3>
                <p className="mb-2">Age: {selectedClient.age}</p>
                <p className="mb-2">Profession: {selectedClient.profession}</p>
                <p className="mb-2">Risk Profile: {selectedClient.riskProfile}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Investment Details</h3>
                <p className="mb-2">Monthly Expenses: {selectedClient.monthlyExpenses.toLocaleString('en-IL', { style: 'currency', currency: 'ILS' })}</p>
                <p className="mb-2">Investment Rate: {selectedClient.investmentPercentage}%</p>
                <p className="mb-2">Monthly Investment: {(selectedClient.monthlyExpenses * (parseFloat(selectedClient.investmentPercentage) / 100)).toLocaleString('en-IL', { style: 'currency', currency: 'ILS' })}</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={selectedClient.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="portfolioValue" stroke="#4F46E5" name="Portfolio Value" />
                <Line type="monotone" dataKey="investment" stroke="#10B981" name="Investment" />
                <Line type="monotone" dataKey="profit" stroke="#F59E0B" name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};
