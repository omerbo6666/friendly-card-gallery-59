import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search } from 'lucide-react';
import Papa from 'papaparse';
import { Client, MonthlyData, MarketData, ClientMetrics, AggregateMetrics } from '@/types/investment';
import { MetricCard } from './MetricCard';
import { ClientCard } from './ClientCard';

interface MarketDataState {
  nasdaq: MarketData[];
  sp500: MarketData[];
}

const COLORS: Record<string, string> = {
  'Doctor': '#10B981',
  'Software Engineer': '#4F46E5',
  'Lawyer': '#F59E0B',
  'Business Owner': '#EF4444',
  'Teacher': '#8B5CF6'
};

export const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllClients, setShowAllClients] = useState(false);
  const [marketData, setMarketData] = useState<MarketDataState>({ nasdaq: [], sp500: [] });

  useEffect(() => {
    loadMarketData();
  }, []);

  const loadMarketData = async () => {
    try {
      const nasdaqFile = await window.fs.readFile('NASDAQ Composite Historical Data.csv', { encoding: 'utf8' });
      const spFile = await window.fs.readFile('SP 500 Historical Data.csv', { encoding: 'utf8' });
      
      const parseMarketData = (csvData) => {
        const parsed = Papa.parse(csvData, { header: true });
        return parsed.data
          .map(row => ({
            date: row.Date,
            change: parseFloat(row['Change %'].replace('%', '')) / 100
          }))
          .filter(row => !isNaN(row.change))
          .reverse();
      };

      const nasdaq = parseMarketData(nasdaqFile);
      const sp500 = parseMarketData(spFile);
      setMarketData({ nasdaq, sp500 });
      generateClients(sp500);
    } catch (error) {
      console.error('Error loading market data:', error);
    }
  };

  const generateClients = (marketReturns) => {
    const generateMonthlyData = () => {
      const data = [];
      let portfolioValue = 0;
      let cumulativeProfit = 0;
      let totalInvestment = 0;

      for (let month = 0; month < 60; month++) {
        const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
        const investmentPercentage = (Math.random() * 17 + 3);
        const investment = monthlyExpense * (investmentPercentage / 100);
        
        const monthlyReturn = marketReturns[month]?.change || 0.006;
        portfolioValue = (portfolioValue + investment) * (1 + monthlyReturn);
        totalInvestment += investment;
        const monthlyProfit = portfolioValue - totalInvestment;
        
        data.push({
          month: month + 1,
          expenses: monthlyExpense,
          investment,
          portfolioValue,
          monthlyProfit,
          totalInvestment,
          profit: monthlyProfit
        });
      }
      return data;
    };

    const professions = ['Doctor', 'Software Engineer', 'Lawyer', 'Business Owner', 'Teacher'];
    const riskProfiles = ['Conservative', 'Moderate', 'Aggressive'];
    
    const newClients = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      name: `Client ${i + 1}`,
      profession: professions[Math.floor(Math.random() * professions.length)],
      riskProfile: riskProfiles[Math.floor(Math.random() * riskProfiles.length)],
      monthlyData: generateMonthlyData()
    }));

    setClients(newClients);
  };

  const calculateClientMetrics = (client) => {
    const lastMonth = client.monthlyData[client.monthlyData.length - 1];
    return {
      monthlyInvestment: lastMonth.investment,
      portfolioValue: lastMonth.portfolioValue,
      totalProfit: lastMonth.profit
    };
  };

  const aggregateMetrics = clients.reduce((acc, client) => {
    const metrics = calculateClientMetrics(client);
    return {
      totalPortfolioValue: acc.totalPortfolioValue + metrics.portfolioValue,
      totalInvestment: acc.totalInvestment + metrics.monthlyInvestment * 60,
      totalProfit: acc.totalProfit + metrics.totalProfit,
      totalClients: clients.length
    };
  }, { totalPortfolioValue: 0, totalInvestment: 0, totalProfit: 0, totalClients: 0 });

  const professionDistribution = Object.entries(
    clients.reduce((acc: Record<string, number>, client) => {
      acc[client.profession] = (acc[client.profession] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({
    name,
    value,
    percentage: Math.round((value / clients.length) * 100)
  }));

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Header Metrics */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Portfolio Value"
          value={`₪${aggregateMetrics.totalPortfolioValue.toLocaleString()}`}
          change="+8.5%"
        />
        <MetricCard
          title="Total Investment"
          value={`₪${aggregateMetrics.totalInvestment.toLocaleString()}`}
          change="+12.3%"
        />
        <MetricCard
          title="Total Profit"
          value={`₪${aggregateMetrics.totalProfit.toLocaleString()}`}
          change="+15.7%"
        />
        <MetricCard
          title="Total Clients"
          value={aggregateMetrics.totalClients}
          change="+5.2%"
        />
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Portfolio Performance Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Portfolio Performance</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart 
              data={selectedClient ? selectedClient.monthlyData : clients[0]?.monthlyData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `₪${value.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="portfolioValue" name="Portfolio Value" stroke="#4F46E5" dot={false} />
              <Line type="monotone" dataKey="investment" name="Monthly Investment" stroke="#10B981" dot={false} />
              <Line type="monotone" dataKey="profit" name="Profit" stroke="#F59E0B" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Client Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Client Distribution</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={professionDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({name, percentage}) => `${name} (${percentage}%)`}
              >
                {professionDistribution.map((entry) => (
                  <Cell key={entry.name} fill={COLORS[entry.name]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Client Overview */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Client Overview</h2>
          <div className="flex gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search clients..."
                className="pl-10 pr-4 py-2 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <button
              onClick={() => setShowAllClients(!showAllClients)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {showAllClients ? 'Show Less' : 'Show All Clients'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {clients
            .filter(client => 
              client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              client.profession.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .slice(0, showAllClients ? undefined : 6)
            .map(client => {
              const metrics = calculateClientMetrics(client);
              return (
                <ClientCard
                  key={client.id}
                  client={client}
                  metrics={metrics}
                  onClick={() => setSelectedClient(client)}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
