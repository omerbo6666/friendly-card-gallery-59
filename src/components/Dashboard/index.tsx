import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ResponsiveLine } from '@nivo/line';
import { Search, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { Client, MonthlyData, ClientMetrics, AggregateMetrics, RiskProfile } from '@/types/investment';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const PROFESSIONS = ['Software Engineer', 'Doctor', 'Lawyer', 'Business Owner', 'Teacher'];
const RISK_PROFILES: RiskProfile[] = ['Conservative', 'Moderate', 'Aggressive'];

const NASDAQ_RETURNS = [
  0.0362, 0.0048, 0.0621, -0.0052, 0.0268, 0.0065, -0.0075, 0.0596, 0.0688, -0.0441,
  0.0179, 0.0612, 0.0102, 0.0552, 0.1070, -0.0278, -0.0581, -0.0217, 0.0405, 0.0659,
  0.0580, 0.0004, 0.0669, -0.0111, 0.1068, -0.0873, 0.0437, 0.0390, -0.1050, -0.0464,
  0.1235, -0.0871, -0.0205, -0.1326, 0.0341, -0.0343, -0.0898, 0.0069, 0.0025, 0.0727,
  -0.0531, 0.0400, 0.0116, 0.0549, -0.0153, 0.0540, 0.0041, 0.0093, 0.0142, 0.0565,
  0.1180, -0.0229, -0.0516, 0.0959, 0.0682, 0.0599, 0.0675, 0.1545, -0.1012, -0.0638,
  0.0199
].reverse();

export const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [comparisonClient, setComparisonClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllClients, setShowAllClients] = useState(false);
  const [visibleSeries, setVisibleSeries] = useState({
    portfolioValue: true,
    investment: true,
    profit: true
  });
  const [investmentPercentage, setInvestmentPercentage] = useState(10);
  const isMobile = useIsMobile();

  useEffect(() => {
    generateClients();
  }, []);

  const generateMonthlyData = (investmentPercentageOverride?: number): MonthlyData[] => {
    const data: MonthlyData[] = [];
    let portfolioValue = 0;
    let cumulativeProfit = 0;
    let totalInvestment = 0;
    
    for (let month = 0; month < NASDAQ_RETURNS.length; month++) {
      const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
      const investmentPercentage = investmentPercentageOverride || (Math.random() * 17 + 3);
      const investment = monthlyExpense * (investmentPercentage / 100);
      
      totalInvestment += investment;
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
    
    const series = [
      {
        id: "Portfolio Value",
        color: "#4F46E5",
        data: data.map(d => ({
          x: `Month ${d.month}`,
          y: Number(d.portfolioValue.toFixed(2))
        })),
        visible: visibleSeries.portfolioValue
      },
      {
        id: "Monthly Investment",
        color: "#10B981",
        data: data.map(d => ({
          x: `Month ${d.month}`,
          y: Number(d.investment.toFixed(2))
        })),
        visible: visibleSeries.investment
      },
      {
        id: "Cumulative Profit",
        color: "#F59E0B",
        data: data.map(d => ({
          x: `Month ${d.month}`,
          y: Number(d.profit.toFixed(2))
        })),
        visible: visibleSeries.profit
      }
    ];

    return series.filter(s => s.visible);
  };

  const handleInvestmentPercentageChange = (value: number[]) => {
    setInvestmentPercentage(value[0]);
    const updatedClients = clients.map(client => ({
      ...client,
      investmentPercentage: value[0].toString(),
      monthlyData: generateMonthlyData(value[0])
    }));
    setClients(updatedClients);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-6 shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-sm text-gray-500">Total Portfolio Value</h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-gray-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The total value of all client portfolios combined</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
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

      <div className="bg-white rounded-xl p-4 mb-8">
        <h3 className="text-sm font-medium mb-4">Chart Controls</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Investment Percentage ({investmentPercentage}%)</Label>
            <Slider
              value={[investmentPercentage]}
              onValueChange={handleInvestmentPercentageChange}
              min={3}
              max={20}
              step={0.5}
              className="mt-2"
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                checked={visibleSeries.portfolioValue}
                onCheckedChange={(checked) => 
                  setVisibleSeries(prev => ({ ...prev, portfolioValue: checked }))
                }
              />
              <Label>Show Portfolio Value</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={visibleSeries.investment}
                onCheckedChange={(checked) => 
                  setVisibleSeries(prev => ({ ...prev, investment: checked }))
                }
              />
              <Label>Show Monthly Investment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={visibleSeries.profit}
                onCheckedChange={(checked) => 
                  setVisibleSeries(prev => ({ ...prev, profit: checked }))
                }
              />
              <Label>Show Cumulative Profit</Label>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow">
          <h2 className="text-lg font-semibold mb-4">Portfolio Performance</h2>
          <div className="h-[300px] md:h-[400px]">
            {clients.length > 0 && (
              <ResponsiveLine
                data={[
                  ...formatChartData(selectedClient ? selectedClient.monthlyData : clients[0]?.monthlyData),
                  ...(comparisonClient ? formatChartData(comparisonClient.monthlyData) : [])
                ]}
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
                  format: (value) => value?.toString() || ''
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  legend: 'Amount (ILS)',
                  legendOffset: -60,
                  legendPosition: 'middle',
                  format: (value) => {
                    if (value === null || value === undefined) return '';
                    if (typeof value === 'number') {
                      return new Intl.NumberFormat('he-IL', {
                        style: 'currency',
                        currency: 'ILS',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0
                      }).format(value);
                    }
                    return value.toString();
                  }
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
                theme={{
                  axis: {
                    ticks: {
                      text: {
                        fontSize: isMobile ? 10 : 12,
                        fill: '#6B7280'
                      }
                    },
                    legend: {
                      text: {
                        fontSize: 12,
                        fill: '#374151'
                      }
                    }
                  },
                  grid: {
                    line: {
                      stroke: '#E5E7EB',
                      strokeWidth: 1
                    }
                  },
                  crosshair: {
                    line: {
                      stroke: '#6B7280',
                      strokeWidth: 1,
                      strokeOpacity: 0.35
                    }
                  },
                  tooltip: {
                    container: {
                      background: 'white',
                      color: '#374151',
                      fontSize: 12,
                      borderRadius: '6px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                      padding: '8px 12px'
                    }
                  }
                }}
                sliceTooltip={({ slice }) => (
                  <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
                    <div className="text-sm font-medium text-gray-900 mb-2">
                      {slice.points[0].data.x}
                    </div>
                    {slice.points.map(point => (
                      <div
                        key={point.id}
                        className="flex items-center py-1"
                      >
                        <div
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: point.serieColor }}
                        />
                        <span className="text-sm text-gray-600">{point.serieId}:</span>
                        <span className="text-sm font-medium ml-2">
                          {new Intl.NumberFormat('he-IL', {
                            style: 'currency',
                            currency: 'ILS',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(point.data.y as number)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              />
            )}
          </div>
        </div>

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
            const isSelected = selectedClient?.id === client.id;
            const isComparison = comparisonClient?.id === client.id;

            return (
              <div
                key={client.id}
                className={`bg-white p-4 md:p-6 rounded-xl shadow cursor-pointer hover:shadow-md transition-shadow ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                } ${isComparison ? 'ring-2 ring-green-500' : ''}`}
                onClick={() => {
                  if (isSelected) {
                    setSelectedClient(null);
                  } else if (isComparison) {
                    setComparisonClient(null);
                  } else if (!selectedClient) {
                    setSelectedClient(client);
                  } else {
                    setComparisonClient(client);
                  }
                }}
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

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-4 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{selectedClient.name}</h2>
                <p className="text-gray-500">{selectedClient.profession}</p>
              </div>
              <button 
                onClick={() => setSelectedClient(null)}
                className="text-gray-500 text-xl p-2"
              >
                ×
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-semibold mb-4">Investment Profile</h3>
                <div className="space-y-2">
                  <p>Risk Profile: {selectedClient.riskProfile}</p>
                  <p>Latest Monthly Investment: {formatCurrency(calculateMetrics(selectedClient).latestMonthlyInvestment)}</p>
                  <p>Total Investment: {formatCurrency(calculateMetrics(selectedClient).totalInvestment)}</p>
                  <p>Portfolio Value: {formatCurrency(calculateMetrics(selectedClient).portfolioValue)}</p>
                  <p>Total Profit: {formatCurrency(calculateMetrics(selectedClient).totalProfit)}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Performance Chart</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ResponsiveLine
                      data={formatChartData(selectedClient.monthlyData)}
                      margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
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
                        legend: 'Month',
                        legendOffset: 40,
                        legendPosition: 'middle'
                      }}
                      axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Value (ILS)',
                        legendOffset: -50,
                        legendPosition: 'middle',
                        format: (value: number) => 
                          new Intl.NumberFormat('he-IL', {
                            style: 'currency',
                            currency: 'ILS',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(value)
                      }}
                      enablePoints={false}
                      pointSize={10}
                      pointColor={{ theme: 'background' }}
                      pointBorderWidth={2}
                      pointBorderColor={{ from: 'serieColor' }}
                      pointLabelYOffset={-12}
                      useMesh={true}
                      legends={[
                        {
                          anchor: 'bottom',
                          direction: 'row',
                          justify: false,
                          translateX: 0,
                          translateY: 50,
                          itemsSpacing: 0,
                          itemDirection: 'left-to-right',
                          itemWidth: 140,
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
                      theme={{
                        axis: {
                          ticks: {
                            text: {
                              fontSize: isMobile ? 10 : 12
                            }
                          }
                        },
                        legends: {
                          text: {
                            fontSize: isMobile ? 10 : 12
                          }
                        }
                      }}
                      tooltip={({ point }) => (
                        <div className="bg-white p-2 shadow rounded border">
                          <strong>{point.serieId}</strong>: {
                            new Intl.NumberFormat('he-IL', {
                              style: 'currency',
                              currency: 'ILS',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                            }).format(Number(point.data.y))
                          }
                        </div>
                      )}
                    />
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-4">Monthly Details</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Month</TableHead>
                      <TableHead>Monthly Expenses</TableHead>
                      <TableHead>Investment Amount</TableHead>
                      <TableHead>Portfolio Value</TableHead>
                      <TableHead>Profit/Loss</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedClient.monthlyData.map((data, index) => (
                      <TableRow key={index}>
                        <TableCell>Month {data.month}</TableCell>
                        <TableCell>{formatCurrency(data.expenses)}</TableCell>
                        <TableCell>{formatCurrency(data.investment)}</TableCell>
                        <TableCell>{formatCurrency(data.portfolioValue)}</TableCell>
                        <TableCell className={data.profit >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(data.profit)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;