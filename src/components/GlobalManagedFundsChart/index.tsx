import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/components/ui/use-toast';
import MetricsPanel from './MetricsPanel';
import ChartControls from './ChartControls';
import LineChart from './LineChart';

interface GlobalMetrics {
  date: string;
  total_managed_funds: number;
  cumulative_investment: number;
  cumulative_profit: number;
  management_fees: number;
  total_clients: number;
}

const GlobalManagedFundsChart = () => {
  const [data, setData] = useState<GlobalMetrics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('1y');
  const { toast } = useToast();

  useEffect(() => {
    fetchGlobalMetrics();
  }, [dateRange]);

  const fetchGlobalMetrics = async () => {
    try {
      console.log('Fetching global metrics...');
      setIsLoading(true);
      
      let query = supabase
        .from('global_metrics')
        .select('*')
        .order('date', { ascending: true });

      // Apply date filtering based on selected range
      const today = new Date();
      let filterDate = new Date();

      switch (dateRange) {
        case '1m':
          filterDate.setMonth(today.getMonth() - 1);
          break;
        case '6m':
          filterDate.setMonth(today.getMonth() - 6);
          break;
        case '1y':
          filterDate.setFullYear(today.getFullYear() - 1);
          break;
        case '2y':
          filterDate.setFullYear(today.getFullYear() - 2);
          break;
        case 'all':
          filterDate = new Date(0); // Beginning of time
          break;
        default:
          filterDate.setFullYear(today.getFullYear() - 1);
      }

      query = query.gte('date', filterDate.toISOString());

      const { data: metricsData, error } = await query;

      if (error) {
        throw error;
      }

      if (!metricsData || metricsData.length === 0) {
        console.log('No metrics data found');
        setData([]);
        setIsLoading(false);
        return;
      }

      console.log('Processed metrics data:', metricsData);
      setData(metricsData);
    } catch (error) {
      console.error('Error fetching global metrics:', error);
      toast({
        title: "Error",
        description: "Failed to load metrics data. Please try again later.",
        variant: "destructive",
      });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    return [
      {
        id: 'Total Managed Funds',
        color: '#fbbf24',
        data: data.map(d => ({
          x: d.date,
          y: d.total_managed_funds,
        }))
      },
      {
        id: 'Cumulative Investment',
        color: '#3b82f6',
        data: data.map(d => ({
          x: d.date,
          y: d.cumulative_investment,
        }))
      },
      {
        id: 'Cumulative Profit',
        color: '#22c55e',
        data: data.map(d => ({
          x: d.date,
          y: d.cumulative_profit,
        }))
      },
      {
        id: 'Management Fees',
        color: '#f97316',
        data: data.map(d => ({
          x: d.date,
          y: d.management_fees,
        }))
      }
    ];
  }, [data]);

  const latestMetrics = React.useMemo(() => {
    if (!data || data.length === 0) return null;
    return data[data.length - 1];
  }, [data]);

  if (isLoading) {
    return (
      <Card className="bg-card text-card-foreground rounded-xl shadow-lg border border-border">
        <CardHeader className="space-y-1.5 p-6">
          <div className="flex items-center gap-2">
            <CardDescription className="text-muted-foreground">
              Loading chart data...
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="h-[500px] bg-background/50 rounded-lg p-4 border border-border/50">
            <Skeleton className="w-full h-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card text-card-foreground rounded-xl shadow-lg border border-border">
        <CardHeader className="space-y-1.5 p-6">
          <ChartControls 
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
          />
          <CardDescription className="text-muted-foreground">
            Track the growth and performance of all managed funds across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          {latestMetrics && (
            <MetricsPanel
              totalClients={latestMetrics.total_clients}
              totalManagedFunds={latestMetrics.total_managed_funds}
              totalProfit={latestMetrics.cumulative_profit}
              managementFees={latestMetrics.management_fees}
            />
          )}
          <LineChart data={chartData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalManagedFundsChart;