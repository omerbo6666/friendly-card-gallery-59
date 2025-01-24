import React, { useState, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useIsMobile } from '@/hooks/use-mobile';
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
import { formatCurrency } from '@/utils/chartDataUtils';
import ChartTooltip from '@/components/ChartTooltip';
import { useToast } from '@/components/ui/use-toast';
import MetricsPanel from './MetricsPanel';

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
  const [startDate, setStartDate] = useState<Date>(new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
  const isMobile = useIsMobile();
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
                <SelectItem value="2y">Last 2 Years</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
          <div className="h-[500px] bg-background/50 rounded-lg p-4 border border-border/50">
            {data.length === 0 ? (
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No data available for the selected time range</p>
              </div>
            ) : (
              <ResponsiveLine
                data={chartData}
                margin={{ 
                  top: 50, 
                  right: isMobile ? 20 : 110, 
                  bottom: 70, 
                  left: isMobile ? 60 : 80 
                }}
                xScale={{
                  type: 'point'
                }}
                yScale={{
                  type: 'linear',
                  min: 'auto',
                  max: 'auto',
                  stacked: false,
                }}
                curve="monotoneX"
                axisTop={null}
                axisRight={null}
                axisBottom={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: -45,
                  format: (value) => value,
                  legend: 'Timeline',
                  legendOffset: 50,
                  legendPosition: 'middle'
                }}
                axisLeft={{
                  tickSize: 5,
                  tickPadding: 5,
                  tickRotation: 0,
                  format: value => formatCurrency(value),
                  legend: 'Amount (₪)',
                  legendOffset: -60,
                  legendPosition: 'middle'
                }}
                enablePoints={false}
                enableArea={true}
                areaOpacity={0.1}
                enableGridX={true}
                enableGridY={true}
                lineWidth={2}
                pointSize={8}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
                legends={[
                  {
                    anchor: 'bottom-right',
                    direction: 'column',
                    justify: false,
                    translateX: 100,
                    translateY: 0,
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
                        fontSize: isMobile ? 10 : 11,
                        fill: 'hsl(var(--muted-foreground))'
                      }
                    },
                    legend: {
                      text: {
                        fontSize: isMobile ? 11 : 12,
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
                      stroke: 'hsl(var(--primary))',
                      strokeWidth: 1,
                      strokeOpacity: 0.5
                    }
                  }
                }}
                tooltip={({ point }) => {
                  const data = point.data as any;
                  return (
                    <div className="bg-popover text-popover-foreground rounded-lg shadow-lg p-3 space-y-2">
                      <div className="font-semibold border-b border-border pb-2">{data.x}</div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: point.serieColor }}
                          />
                          <span>{point.serieId}:</span>
                          <span className="font-semibold">{formatCurrency(data.y)}</span>
                        </div>
                      </div>
                    </div>
                  );
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalManagedFundsChart;