import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, ArrowUpRight, Users, Wallet, TrendingUp, DollarSign } from 'lucide-react';
import { Client, MonthlyData, ClientMetrics, AggregateMetrics, RiskProfile } from '@/types/investment';

// Constants
const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const PROFESSIONS = ['Software Engineer', 'Doctor', 'Lawyer', 'Business Owner', 'Teacher'];
const RISK_PROFILES: RiskProfile[] = ['Conservative', 'Moderate', 'Aggressive'];

export const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllClients, setShowAllClients] = useState(false);

  useEffect(() => {
    generateClients();
  }, []);

  const generateMonthlyData = (): MonthlyData[] => {
    const data: MonthlyData[] = [];
    let portfolioValue = 0;
    const monthlyReturn = Math.pow(1 + 0.0711, 1/12) - 1;
    
    for (let month = 1; month <= 60; month++) {
      const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
      const investmentPercentage = (Math.random() * 17 + 3);
      const investment = monthlyExpense * (investmentPercentage / 100);
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

  const generateClients = () => {
    const newClients: Client[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Client ${i + 1}`,
      profession: PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)],
      riskProfile: RISK_PROFILES[Math.floor(Math.random() * RISK_PROFILES.length)],
      monthlyData: generateMonthlyData()
    }));

    setClients(newClients);
  };

  const calculateMetrics = (client: Client): ClientMetrics => {
    const lastMonth = client.monthlyData[client.monthlyData.length - 1];
    return {
      totalInvestment: client.monthlyData.reduce((sum, data) => sum + data.investment, 0),
      portfolioValue: lastMonth.portfolioValue,
      totalProfit: lastMonth.profit,
      latestMonthlyInvestment: lastMonth.investment,
      managementFee: client.monthlyData.reduce((sum, data) => sum + data.investment, 0) * 0.005
    };
  };

  const aggregateMetrics: AggregateMetrics = clients.reduce((acc, client) => {
    const metrics = calculateMetrics(client);
    return {
      totalValue: acc.totalValue + metrics.portfolioValue,
      totalInvestment: acc.totalInvestment + metrics.totalInvestment,
      totalProfit: acc.totalProfit + metrics.totalProfit,
      totalClients: clients.length
    };
  }, { totalValue: 0, totalInvestment: 0, totalProfit: 0, totalClients: 0 });

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.profession.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header with Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Portfolio Value</h3>
          <div className="text-2xl font-bold">₪{aggregateMetrics.totalValue.toLocaleString()}</div>
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            <span>8.5%</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Investment</h3>
          <div className="text-2xl font-bold">₪{aggregateMetrics.totalInvestment.toLocaleString()}</div>
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            <span>12.3%</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Profit</h3>
          <div className="text-2xl font-bold">₪{aggregateMetrics.totalProfit.toLocaleString()}</div>
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            <span>15.7%</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Clients</h3>
          <div className="text-2xl font-bold">{aggregateMetrics.totalClients}</div>
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            <span>5.2%</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Portfolio Performance</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={selectedClient ? selectedClient.monthlyData : clients[0]?.monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip 
                formatter={(value) => `₪${value.toLocaleString()}`}
                labelFormatter={(label) => `Month ${label}`}
              />
              <Legend />
              <Line type="monotone" dataKey="portfolioValue" name="Portfolio Value" stroke="#4F46E5" strokeWidth={2} />
              <Line type="monotone" dataKey="investment" name="Monthly Investment" stroke="#10B981" />
              <Line type="monotone" dataKey="profit" name="Profit" stroke="#F59E0B" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Client Distribution */}
        <div className="bg-white rounded-xl p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Client Distribution</h2>
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
                label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {PROFESSIONS.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Overview */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Client Overview</h2>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 rounded-lg border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowAllClients(!showAllClients)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {showAllClients ? 'Show Less' : 'Show All Clients'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {filteredClients.slice(0, showAllClients ? undefined : 6).map(client => {
            const metrics = calculateMetrics(client);
            return (
              <div
                key={client.id}
                className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedClient(client)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{client.name}</h3>
                    <p className="text-sm text-gray-500">{client.profession}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    client.riskProfile === 'Conservative' ? 'bg-blue-100 text-blue-800' :
                    client.riskProfile === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {client.riskProfile}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Monthly Investment:</span>
                    <span>₪{metrics.latestMonthlyInvestment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Portfolio Value:</span>
                    <span>₪{metrics.portfolioValue.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Profit:</span>
                    <span>₪{metrics.totalProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{selectedClient.name}</h2>
                <p className="text-gray-500">{selectedClient.profession}</p>
              </div>
              <button onClick={() => setSelectedClient(null)} className="text-gray-500">×</button>
            </div>
            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">Investment Profile</h3>
                <div className="space-y-2">
                  <p>Risk Profile: {selectedClient.riskProfile}</p>
                  <p>Latest Monthly Investment: ₪{calculateMetrics(selectedClient).latestMonthlyInvestment.toLocaleString()}</p>
                  <p>Total Investment: ₪{calculateMetrics(selectedClient).totalInvestment.toLocaleString()}</p>
                  <p>Portfolio Value: ₪{calculateMetrics(selectedClient).portfolioValue.toLocaleString()}</p>
                  <p>Total Profit: ₪{calculateMetrics(selectedClient).totalProfit.toLocaleString()}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Performance Chart</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={selectedClient.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₪${value.toLocaleString()}`} />
                    <Legend />
                    <Line type="monotone" dataKey="portfolioValue" name="Portfolio Value" stroke="#4F46E5" />
                    <Line type="monotone" dataKey="investment" name="Monthly Investment" stroke="#10B981" />
                    <Line type="monotone" dataKey="profit" name="Profit" stroke="#F59E0B" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
