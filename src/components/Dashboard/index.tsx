import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { ResponsiveLine } from '@nivo/line';
import { Search, ArrowUpRight, ArrowDownRight, HelpCircle } from 'lucide-react';
import { Client, MonthlyData, ClientMetrics, AggregateMetrics } from '@/types/investment';
import { useIsMobile } from '@/hooks/use-mobile';
import { ThemeToggle } from '@/components/ThemeToggle';
import ClientDetails from '@/components/ClientDetails';
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
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { getClients, saveClients, searchClients } from '@/lib/localStorage';
import { INVESTMENT_TRACKS, PROFESSIONS } from '@/lib/constants';
import PerformanceChart from '@/components/PerformanceChart';

const COLORS = ['#8B5CF6', '#0EA5E9', '#F97316', '#D946EF', '#10B981'];
const RISK_PROFILES = ['Conservative', 'Moderate', 'Aggressive'];

const NASDAQ_RETURNS = [
  0.0362, 0.0048, 0.0621, -0.0052, 0.0268, 0.0065, -0.0075, 0.0596, 0.0688, -0.0441,
  0.0179, 0.0612, 0.0102, 0.0552, 0.1070, -0.0278, -0.0581, -0.0217, 0.0405, 0.0659,
  0.0580, 0.0004, 0.0669, -0.0111, 0.1068, -0.0873, 0.0437, 0.0390, -0.1050, -0.0464,
  0.1235, -0.0871, -0.0205, -0.1326, 0.0341, -0.0343, -0.0898, 0.0069, 0.0025, 0.0727,
  -0.0531, 0.0400, 0.0116, 0.0549, -0.0153, 0.0540, 0.0041, 0.0093, 0.0142, 0.0565,
  0.1180, -0.0229, -0.0516, 0.0959, 0.0682, 0.0599, 0.0675, 0.1545, -0.1012, -0.0638,
  0.0199
].reverse();

const SP500_RETURNS = [
  0.0348, -0.0250, 0.0573, -0.0099, 0.0202, 0.0228, 0.0113, 0.0347, 0.0480, -0.0416,
  0.0310, 0.0517, 0.0159, 0.0442, 0.0892, -0.0220, -0.0487, -0.0177, 0.0311, 0.0647,
  0.0025, 0.0146, 0.0351, -0.0261, 0.0618, -0.0590, 0.0538, 0.0799, -0.0934, -0.0424,
  0.0911, -0.0839, 0.0001, -0.0880, 0.0358, -0.0314, -0.0526, 0.0436, -0.0083, 0.0691,
  -0.0476, 0.0290, 0.0227, 0.0222, 0.0055, 0.0524, 0.0424, 0.0261, -0.0111, 0.0371,
  0.1075, -0.0277, -0.0392, 0.0701, 0.0551, 0.0184, 0.0453, 0.1268, -0.1251, -0.0841,
  -0.0016, 0.0286, 0.0340, 0.0204, 0.0172, -0.0181, 0.0131, 0.0689, -0.0658, 0.0393,
  0.0179, 0.0297, 0.0787
].reverse();

const generateRandomName = () => {
  const FIRST_NAMES = [
    'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
    'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
    'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander'
  ];

  const LAST_NAMES = [
    'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
    'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
    'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'
  ];

  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
};

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
  const navigate = useNavigate();

  useEffect(() => {
    const storedClients = getClients();
    if (storedClients.length === 0) {
      generateClients();
    } else {
      setClients(storedClients);
    }
  }, []);

  const generateMonthlyData = ({ investmentPercentageOverride, investmentTrack, startDate }: { investmentPercentageOverride?: number; investmentTrack?: string; startDate?: Date } = {}): MonthlyData[] => {
    const data: MonthlyData[] = [];
    let portfolioValue = 0;
    let cumulativeProfit = 0;
    let totalInvestment = 0;
    
    const returns = investmentTrack === 'SPY500' ? SP500_RETURNS : NASDAQ_RETURNS;
    
    for (let month = 0; month < returns.length; month++) {
      const monthlyExpense = Math.floor(Math.random() * 16000) + 4000;
      const investmentPercentage = investmentPercentageOverride || (Math.random() * 17 + 3);
      const investment = monthlyExpense * (investmentPercentage / 100);
      
      totalInvestment += investment;
      const monthlyReturn = returns[month];
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
      const tracks = INVESTMENT_TRACKS.map(track => track.id);
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      
      const today = new Date();
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(today.getFullYear() - 2);
      const randomStartDate = new Date(
        twoYearsAgo.getTime() + Math.random() * (today.getTime() - twoYearsAgo.getTime())
      );
      
      return {
        id: i + 1,
        name: generateRandomName(),
        profession: PROFESSIONS[Math.floor(Math.random() * PROFESSIONS.length)],
        investmentTrack: randomTrack,
        monthlyData: generateMonthlyData({ 
          investmentPercentageOverride: Number(investmentPercentage), 
          investmentTrack: randomTrack,
          startDate: randomStartDate
        }),
        monthlyExpenses,
        investmentPercentage,
        startDate: randomStartDate
      };
    });

    setClients(newClients);
    saveClients(newClients);
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

  const filteredClients = searchTerm ? searchClients(searchTerm) : clients;

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
        color: "#8B5CF6",
        data: data.map(d => ({
          x: `Month ${d.month}`,
          y: Number(d.portfolioValue.toFixed(2))
        })),
        visible: visibleSeries.portfolioValue
      },
      {
        id: "Monthly Investment",
        color: "#0EA5E9",
        data: data.map(d => ({
          x: `Month ${d.month}`,
          y: Number(d.investment.toFixed(2))
        })),
        visible: visibleSeries.investment
      },
      {
        id: "Cumulative Profit",
        color: "#F97316",
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
      monthlyData: generateMonthlyData({ investmentPercentageOverride: value[0], investmentTrack: client.investmentTrack })
    }));
    setClients(updatedClients);
    saveClients(updatedClients);
  };

  const handleClientClick = (client: Client) => {
    console.log('Selecting client:', client.name);
    setSelectedClient(client);
    
    // Smooth scroll to top
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    });
    
    // Find and scroll the client card into view
    const clientCardId = `client-${client.id}`;
    const clientCard = document.getElementById(clientCardId);
    if (clientCard) {
      clientCard.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-2 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-8">
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 mb-4 md:mb-0">
          <div className="w-full sm:w-auto">
            <Button 
              size="lg"
              className="w-full h-auto bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white font-semibold px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/add-client')}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs md:text-base font-bold tracking-tight">
                  Add New Client
                </span>
                <span className="text-xs md:text-sm font-normal text-white/90">
                  Start managing a new portfolio
                </span>
              </div>
            </Button>
          </div>
          
          <div className="w-full sm:w-auto">
            <Button 
              size="lg"
              className="w-full h-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              onClick={() => navigate('/simulator')}
            >
              <div className="flex flex-col items-center gap-2">
                <span className="text-xs md:text-base font-bold tracking-tight">
                  Investment Simulator
                </span>
                <span className="text-xs md:text-sm font-normal text-white/90">
                  See how your money could grow
                </span>
              </div>
            </Button>
          </div>
        </div>
        <ThemeToggle />
      </div>

      <div className="mb-6 md:mb-8">
        <PerformanceChart />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-sm border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xs md:text-sm text-muted-foreground">Total Portfolio Value</h3>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger>
                  <HelpCircle className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>The total value of all client portfolios combined</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          <div className="text-lg md:text-2xl font-bold">{formatCurrency(aggregateMetrics.totalValue)}</div>
          <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-xs md:text-sm">
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            <span>{formatPercentage(8.5)}</span>
          </div>
        </div>
        <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-sm border border-border">
          <h3 className="text-xs md:text-sm text-muted-foreground">Total Investment</h3>
          <div className="text-lg md:text-2xl font-bold">{formatCurrency(aggregateMetrics.totalInvestment)}</div>
          <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-xs md:text-sm">
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            <span>{formatPercentage(12.3)}</span>
          </div>
        </div>
        <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-sm border border-border">
          <h3 className="text-xs md:text-sm text-muted-foreground">Total Profit</h3>
          <div className="text-lg md:text-2xl font-bold">{formatCurrency(aggregateMetrics.totalProfit)}</div>
          <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-xs md:text-sm">
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            <span>{formatPercentage(15.7)}</span>
          </div>
        </div>
        <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-sm border border-border">
          <h3 className="text-xs md:text-sm text-muted-foreground">Total Clients</h3>
          <div className="text-lg md:text-2xl font-bold">{aggregateMetrics.totalClients}</div>
          <div className="flex items-center text-emerald-500 dark:text-emerald-400 text-xs md:text-sm">
            <ArrowUpRight className="w-3 h-3 md:w-4 md:h-4" />
            <span>{formatPercentage(5.2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-xl p-3 md:p-4 mb-6 md:mb-8 border border-border">
        <h3 className="text-xs md:text-sm font-medium mb-3 md:mb-4">Chart Controls</h3>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
        {selectedClient ? (
          <>
            <div className="bg-card text-card-foreground rounded-xl p-3 md:p-6 shadow-sm border border-border col-span-1 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedClient(null)}
                  className="mb-4"
                >
                  ← Back to All Portfolios
                </Button>
              </div>
              <ClientDetails 
                client={selectedClient} 
                metrics={calculateMetrics(selectedClient)}
              />
            </div>
          </>
        ) : (
          <>
            <div className="bg-card text-card-foreground rounded-xl p-3 md:p-6 shadow-sm border border-border col-span-1 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xs md:text-base font-semibold">Portfolio Performance</h2>
              </div>
              <div className="h-[400px] md:h-[500px] w-full">
                {clients.length > 0 && (
                  <ResponsiveLine
                    data={formatChartData(clients[0]?.monthlyData)}
                    margin={{ top: 30, right: 40, bottom: 70, left: 60 }}
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
                      legendOffset: 50,
                      legendPosition: 'middle',
                      format: (value) => value?.toString() || ''
                    }}
                    axisLeft={{
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0,
                      legend: 'Amount (ILS)',
                      legendOffset: -45,
                      legendPosition: 'middle',
                      format: (value) => {
                        if (value === null || value === undefined) return '';
                        if (typeof value === 'number') {
                          return new Intl.NumberFormat('he-IL', {
                            style: 'currency',
                            currency: 'ILS',
                            notation: 'compact',
                            maximumFractionDigits: 1
                          }).format(value);
                        }
                        return value.toString();
                      }
                    }}
                    enableGridX={false}
                    enableGridY={true}
                    lineWidth={3}
                    pointSize={isMobile ? 4 : 6}
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
                        anchor: 'bottom',
                        direction: 'row',
                        justify: false,
                        translateX: 0,
                        translateY: 60,
                        itemsSpacing: 10,
                        itemDirection: 'left-to-right',
                        itemWidth: isMobile ? 80 : 120,
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
                            fontSize: isMobile ? 8 : 11,
                            fill: 'hsl(var(--muted-foreground))'
                          }
                        },
                        legend: {
                          text: {
                            fontSize: isMobile ? 9 : 12,
                            fill: 'hsl(var(--muted-foreground))',
                            fontWeight: 500
                          }
                        }
                      },
                      grid: {
                        line: {
                          stroke: 'hsl(var(--border))',
                          strokeWidth: 1,
                          strokeDasharray: '4 4'
                        }
                      },
                      crosshair: {
                        line: {
                          stroke: 'hsl(var(--muted-foreground))',
                          strokeWidth: 1,
                          strokeOpacity: 0.35
                        }
                      },
                      tooltip: {
                        container: {
                          background: 'hsl(var(--background))',
                          color: 'hsl(var(--foreground))',
                          fontSize: isMobile ? 10 : 12,
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                          padding: '6px 10px',
                          border: '1px solid hsl(var(--border))'
                        }
                      }
                    }}
                  />
                )}
              </div>
            </div>

            <div className="bg-card text-card-foreground rounded-xl p-3 md:p-6 shadow-sm border border-border col-span-1 lg:col-span-2">
              <h2 className="text-sm md:text-base font-semibold mb-3 md:mb-4">Client Distribution</h2>
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
                      style={{ fontSize: isMobile ? '10px' : '12px' }}
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
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 md:mt-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <h2 className="text-sm md:text-lg font-semibold">Client Overview</h2>
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search clients..."
                className="w-full md:w-[200px] pl-10 pr-4 py-2 rounded-lg border border-input bg-background"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => setShowAllClients(!showAllClients)}
              className="w-full md:w-auto"
              variant="outline"
            >
              {showAllClients ? 'Show Less' : 'Show All Clients'}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filteredClients.slice(0, showAllClients ? undefined : 6).map(client => {
            const metrics = calculateMetrics(client);
            const isSelected = selectedClient?.id === client.id;
            const selectedTrack = INVESTMENT_TRACKS.find(track => track.id === client.investmentTrack);

            return (
              <div
                key={client.id}
                id={`client-${client.id}`}
                className={`bg-card text-card-foreground p-4 md:p-6 rounded-xl shadow-sm border border-border cursor-pointer hover:shadow-md transition-shadow ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleClientClick(client)}
              >
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div>
                    <h3 className="font-semibold text-sm md:text-lg">{client.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{client.profession}</p>
                  </div>
                  <span className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm ${
                    selectedTrack?.id === 'SPY500' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    selectedTrack?.id === 'NASDAQ100' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  }`}>
                    {selectedTrack?.name}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="border-b border-border pb-4">
                    <h4 className="font-medium mb-4">Investment Profile</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Investment Track:</span>
                        <span className="text-sm font-medium">{selectedTrack?.name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Portfolio Value:</span>
                        <span className="text-sm font-medium">{formatCurrency(metrics.portfolioValue)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Expenses:</span>
                        <span className="text-sm font-medium">{formatCurrency(client.monthlyExpenses * 12)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Investment:</span>
                        <span className="text-sm font-medium">{formatCurrency(metrics.totalInvestment)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Total Profit:</span>
                        <span className={`text-sm font-medium ${
                          metrics.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(metrics.totalProfit)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Latest Monthly Investment:</span>
                        <span className="text-sm font-medium">{formatCurrency(metrics.latestMonthlyInvestment)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
