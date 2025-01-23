import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ResponsiveLine } from '@nivo/line';
import { Search, ArrowUpRight, Maximize2 } from 'lucide-react';
import { Client, MonthlyData, ClientMetrics, AggregateMetrics, RiskProfile } from '@/types/investment';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from "@/components/ui/button";
import { MaximizedChart } from './MaximizedChart';
import { ClientInsights } from './ClientInsights';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const PROFESSIONS = ['Software Engineer', 'Doctor', 'Lawyer', 'Business Owner', 'Teacher'];
const RISK_PROFILES: RiskProfile[] = ['Conservative', 'Moderate', 'Aggressive'];

// NASDAQ 100 monthly returns from 2020-2025
const NASDAQ_RETURNS = [
  0.0362, 0.0048, 0.0621, -0.0052, 0.0268, 0.0065, -0.0075, 0.0596, 0.0688, -0.0441,
  0.0179, 0.0612, 0.0102, 0.0552, 0.1070, -0.0278, -0.0581, -0.0217, 0.0405, 0.0659,
  0.0580, 0.0004, 0.0669, -0.0111, 0.1068, -0.0873, 0.0437, 0.0390, -0.1050, -0.0464,
  0.1235, -0.0871, -0.0205, -0.1326, 0.0341, -0.0343, -0.0898, 0.0069, 0.0025, 0.0727,
  -0.0531, 0.0400, 0.0116, 0.0549, -0.0153, 0.0540, 0.0041, 0.0093, 0.0142, 0.0565,
  0.1180, -0.0229, -0.0516, 0.0959, 0.0682, 0.0599, 0.0675, 0.1545, -0.1012, -0.0638,
  0.0199
].reverse(); // Reverse to start from oldest to newest

export const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllClients, setShowAllClients] = useState(false);
  const [isChartMaximized, setIsChartMaximized] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    generateClients();
  }, []);

  const generateMonthlyData = (): MonthlyData[] => {
    const data: MonthlyData[] = [];
    let portfolioValue = 0;
    let cumulativeProfit = 0;
    let totalInvestment = 0;
    
    for (let month = 0; month < NASDAQ_RETURNS.length; month++) {
      const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
      const investmentPercentage = (Math.random() * 17 + 3);
      const investment = monthlyExpense * (investmentPercentage / 100);
      
      totalInvestment += investment;
      // Use actual NASDAQ returns for this month
      const monthlyReturn = NASDAQ_RETURNS[month];
      portfolioValue = (portfolioValue + investment) * (1 + monthlyReturn);
      cumulativeProfit = portfolioValue - totalInvestment;
      
      data.push({
        month: month + 1,
        expenses: monthlyExpense,
        investment,
        portfolioValue,
        profit: cumulativeProfit
      });
    }
    return data;
  };

  const generateClients = () => {
    const newClients: Client[] = Array.from({ length: 100 }, (_, i) => {
      const monthlyExpenses = Math.floor(Math.random() * 16000) + 4000;
      const investmentPercentage = (Math.random() * 17 + 3).toFixed(1);
      
      return {
        id: i + 1,
        name: `Client ${i + 1}`,
        profession: PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)],
        riskProfile: RISK_PROFILES[Math.floor(Math.random() * RISK_PROFILES.length)],
        monthlyData: generateMonthlyData(),
        monthlyExpenses,
        investmentPercentage
      };
    });

    setClients(newClients);
  };

  const calculateMetrics = (client: Client): ClientMetrics => {
    const lastMonth = client.monthlyData[client.monthlyData.length - 1];
    const totalInvestment = client.monthlyData.reduce((sum, data) => sum + data.investment, 0);
    
    return {
      totalInvestment,
      portfolioValue: lastMonth.portfolioValue,
      totalProfit: lastMonth.profit,
      latestMonthlyInvestment: lastMonth.investment,
      managementFee: totalInvestment * 0.005 // 0.5% management fee
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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('en', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  const formatChartData = (data: MonthlyData[] | undefined) => {
    if (!data) return [];
    
    return [
      {
        id: "Portfolio Value",
        color: "#4F46E5",
        data: data.map(d => ({
          x: d.month,
          y: Number(d.portfolioValue.toFixed(2))
        }))
      },
      {
        id: "Monthly Investment",
        color: "#10B981",
        data: data.map(d => ({
          x: d.month,
          y: Number(d.investment.toFixed(2))
        }))
      },
      {
        id: "Cumulative Profit",
        color: "#F59E0B",
        data: data.map(d => ({
          x: d.month,
          y: Number(d.profit.toFixed(2))
        }))
      }
    ];
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header with Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Portfolio Value</h3>
          <div className="text-xl md:text-2xl font-bold">{formatCurrency(aggregateMetrics.totalValue)}</div>
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            <span>{formatPercentage(8.5)}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Investment</h3>
          <div className="text-xl md:text-2xl font-bold">{formatCurrency(aggregateMetrics.totalInvestment)}</div>
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            <span>{formatPercentage(12.3)}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Profit</h3>
          <div className="text-xl md:text-2xl font-bold">{formatCurrency(aggregateMetrics.totalProfit)}</div>
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            <span>{formatPercentage(15.7)}</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow">
          <h3 className="text-sm text-gray-500">Total Clients</h3>
          <div className="text-xl md:text-2xl font-bold">{aggregateMetrics.totalClients}</div>
          <div className="flex items-center text-green-500">
            <ArrowUpRight className="w-4 h-4" />
            <span>{formatPercentage(5.2)}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Performance Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Portfolio Performance</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsChartMaximized(true)}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="h-[300px] md:h-[400px]">
            {clients.length > 0 && (
              <ResponsiveLine
                data={formatChartData(selectedClient ? selectedClient.monthlyData : clients[0]?.monthlyData) || []}
                margin={{ top: 30, right: 110, bottom: 50, left: 80 }}
                xScale={{
                  type: 'point'
                }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                  reverse: false
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  legend: 'Timeline',
                  legendOffset: 40,
                  legendPosition: 'middle',
                  format: (value) => `Month ${value}`
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Amount (ILS)',
                  legendOffset: -60,
                  legendPosition: 'middle',
                  format: (value) => formatCurrency(Number(value))
                }}
                enableGridX={false}
                enableGridY={true}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                enableArea={true}
                areaOpacity={0.15}
                useMesh={true}
                enableSlices="x"
                crosshairType="cross"
                motionConfig="gentle"
                legends={[
                  {
                    anchor: 'right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
                    itemsSpacing: 0,
                    itemDirection: 'left-to-right',
                    itemWidth: 100,
                    itemHeight: 20,
                    itemOpacity: 0.75,
                    symbolSize: 12,
                    symbolShape: 'circle',
                    symbolBorderColor: 'rgba(0, 0, 0, .5)',
                    effects: [
                      {
                        on: 'hover',
                        style: {
                          itemBackground: 'rgba(0, 0, 0, .03)',
                          itemOpacity: 1
                        }
                      }
                    ]
                  }
                ]}
              />
            )}
          </div>
        </div>

        {/* Client Distribution Chart */}
        <div className="bg-white rounded-xl p-4 md:p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Client Distribution</h2>
          <div className="h-[300px] md:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PROFESSIONS.map(profession => ({
                    name: profession,
                    value: clients.filter(client => client.profession === profession).length
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={isMobile ? 60 : 80}
                  outerRadius={isMobile ? 90 : 120}
                  fill="#8884d8"
                  paddingAngle={2}
                  dataKey="value"
                  label={({name, percent}) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  labelLine={{ stroke: '#374151', strokeWidth: 1 }}
                >
                  {PROFESSIONS.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200">
                          <p className="text-sm font-medium text-gray-900">{payload[0].name}</p>
                          <p className="text-sm text-gray-600">
                            Clients: {payload[0].value}
                            <span className="ml-2">
                              ({((payload[0].value / clients.length) * 100).toFixed(1)}%)
                            </span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {selectedClient && (
        <div className="mt-8">
          <ClientInsights client={selectedClient} />
        </div>
      )}

      {/* Client Overview Section */}
      <div className="mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-lg font-semibold">Client Overview</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full md:w-auto pl-10 pr-4 py-2 rounded-lg border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowAllClients(!showAllClients)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg w-full md:w-auto"
            >
              {showAllClients ? 'Show Less' : 'Show All Clients'}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.slice(0, showAllClients ? undefined : 6).map(client => {
            const metrics = calculateMetrics(client);
            return (
              <div
                key={client.id}
                className="bg-white p-4 md:p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition-shadow"
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
                    <span>{formatCurrency(metrics.latestMonthlyInvestment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Portfolio Value:</span>
                    <span>{formatCurrency(metrics.portfolioValue)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Profit:</span>
                    <span>{formatCurrency(metrics.totalProfit)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Maximized Chart Modal */}
      <MaximizedChart
        isOpen={isChartMaximized}
        onClose={() => setIsChartMaximized(false)}
        data={formatChartData(selectedClient ? selectedClient.monthlyData : clients[0]?.monthlyData) || []}
        title="Portfolio Performance"
      />
    </div>
  );
};

export default Dashboard;