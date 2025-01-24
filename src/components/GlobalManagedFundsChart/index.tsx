import React, { useState, useEffect } from 'react';
import { ChartLine } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from '@/components/ui/use-toast';
import { GlobalMetrics } from '@/types/investment';
import MetricsPanel from './MetricsPanel';
import ChartContainer from './ChartContainer';

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
      
      const { data: metricsData, error } = await supabase
        .from('global_metrics')
        .select('*')
        .order('date', { ascending: true });

      if (error) {
        throw error;
      }

      if (!metricsData || metricsData.length === 0) {
        console.log('No metrics data found');
        setData([]);
        return;
      }

      const filteredData = filterDataByDateRange(metricsData, dateRange);
      setData(filteredData);
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

  const filterDataByDateRange = (data: GlobalMetrics[], range: string): GlobalMetrics[] => {
    const now = new Date();
    const cutoffDate = new Date();
    
    switch (range) {
      case '1m':
        cutoffDate.setMonth(now.getMonth() - 1);
        break;
      case '6m':
        cutoffDate.setMonth(now.getMonth() - 6);
        break;
      case '1y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return data;
    }
    
    return data.filter(item => new Date(item.date) >= cutoffDate);
  };

  const latestMetrics = data[data.length - 1] || {
    total_clients: 0,
    total_managed_funds: 0,
    cumulative_profit: 0,
    management_fees: 0,
  };

  if (isLoading) {
    return (
      <Card className="bg-card text-card-foreground rounded-xl shadow-lg border border-border">
        <CardHeader className="space-y-1.5 p-6">
          <div className="flex items-center gap-2">
            <ChartLine className="w-5 h-5 text-primary" />
            <CardTitle className="text-2xl font-bold">
              Global Managed Funds Overview
            </CardTitle>
          </div>
          <CardDescription className="text-muted-foreground">
            Loading chart data...
          </CardDescription>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChartLine className="w-5 h-5 text-primary" />
              <CardTitle className="text-2xl font-bold">
                Global Managed Funds Overview
              </CardTitle>
            </div>
            <Select
              value={dateRange}
              onValueChange={(value) => setDateRange(value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">Last Month</SelectItem>
                <SelectItem value="6m">Last 6 Months</SelectItem>
                <SelectItem value="1y">Last Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription className="text-muted-foreground">
            Track the growth and performance of all managed funds across the platform
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <MetricsPanel
            totalClients={latestMetrics.total_clients}
            totalManagedFunds={latestMetrics.total_managed_funds}
            totalProfit={latestMetrics.cumulative_profit}
            managementFees={latestMetrics.management_fees}
          />
          <div className="h-[500px] bg-background/50 rounded-lg p-4 border border-border/50">
            {data.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No data available for the selected time range</p>
              </div>
            ) : (
              <ChartContainer data={data} />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalManagedFundsChart;