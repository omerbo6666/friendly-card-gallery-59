import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from "@/integrations/supabase/client";
import { Client, ClientMetrics } from '@/types/investment';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  HelpCircle,
  Wallet,
  LineChart,
  Plus
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import PerformanceChart from '@/components/PerformanceChart';
import AllocationSummary from '@/components/AllocationSummary';
import ClientDetails from '@/components/ClientDetails';

export const Dashboard = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllClients, setShowAllClients] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_allocations (
            track_id,
            percentage
          ),
          monthly_performance (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        console.log('Fetched clients:', data);
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Error",
        description: "Failed to fetch clients data",
        variant: "destructive",
      });
    }
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

  const aggregateMetrics = clients.reduce((acc, client) => {
    const metrics = calculateMetrics(client);
    return {
      totalValue: acc.totalValue + metrics.portfolioValue,
      totalInvestment: acc.totalInvestment + metrics.totalInvestment,
      totalProfit: acc.totalProfit + metrics.totalProfit,
      totalClients: clients.length
    };
  }, { totalValue: 0, totalInvestment: 0, totalProfit: 0, totalClients: 0 });

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

  const calculateROI = (totalValue: number, totalInvestment: number): string => {
    return ((totalValue - totalInvestment) / totalInvestment * 100).toFixed(2);
  };

  const MetricCard = ({ title, value, subValue, icon: Icon, trend, tooltipContent }: any) => (
    <Card className="bg-card/50 hover:bg-card/70 transition-colors">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
              {tooltipContent && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground/70" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{tooltipContent}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {value}
              {trend && (
                <span className={`text-sm font-medium flex items-center ${
                  trend > 0 ? "text-green-500" : "text-red-500"
                }`}>
                  {trend > 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {Math.abs(trend)}%
                </span>
              )}
            </div>
            {subValue && (
              <div className="text-sm text-muted-foreground">{subValue}</div>
            )}
          </div>
          <Icon className="w-5 h-5 text-primary/70" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Investment Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your investment portfolio</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => navigate('/add-client')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Client
          </Button>
          <ThemeToggle />
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Investment"
          value={formatCurrency(aggregateMetrics.totalInvestment)}
          subValue={`${aggregateMetrics.totalClients} Active Clients`}
          icon={Wallet}
          tooltipContent="Total amount invested across all portfolios"
        />
        
        <MetricCard
          title="Portfolio Value"
          value={formatCurrency(aggregateMetrics.totalValue)}
          subValue={`Management Fee: ${formatCurrency(aggregateMetrics.totalInvestment * 0.02)}`}
          icon={DollarSign}
          trend={5.2}
          tooltipContent="Current total value of all investments"
        />
        
        <MetricCard
          title="Total Profit"
          value={formatCurrency(aggregateMetrics.totalProfit)}
          subValue={`ROI: ${calculateROI(aggregateMetrics.totalValue, aggregateMetrics.totalInvestment)}%`}
          icon={LineChart}
          trend={12.5}
          tooltipContent="Net profit from all investments"
        />

        <MetricCard
          title="Performance Overview"
          value="Above Average"
          subValue="Outperforming market by 2.3%"
          icon={TrendingUp}
          trend={2.3}
          tooltipContent="Overall portfolio performance relative to market benchmarks"
        />
      </div>

      {/* Performance Chart Section */}
      <div className="grid gap-6">
        <PerformanceChart showTrackSelector={false} />
      </div>

      {/* Historical Performance & Allocation Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Historical Performance */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Historical Performance</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">SPY500</span>
              <span className="text-sm font-medium text-green-500">+140% (5Y)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">NASDAQ100</span>
              <span className="text-sm font-medium text-green-500">+180% (5Y)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">RUSSELL2000</span>
              <span className="text-sm font-medium text-green-500">+120% (5Y)</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              SPY500 has shown consistent growth, outperforming other indexes with a 140% return over the past 5 years.
              The NASDAQ100 demonstrated higher volatility but greater returns, while RUSSELL2000 provided stable growth.
            </p>
          </div>
        </Card>

        {/* Allocation Summary */}
        {selectedClient && selectedClient.allocations && (
          <AllocationSummary allocations={selectedClient.allocations} />
        )}
      </div>

      {/* Client Details Section */}
      {selectedClient && (
        <ClientDetails 
          client={selectedClient}
          metrics={calculateMetrics(selectedClient)}
        />
      )}
    </div>
  );
};

export default Dashboard;