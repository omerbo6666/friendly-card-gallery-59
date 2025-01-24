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
import { aggregateMonthlyData, formatCurrency } from '@/utils/chartDataUtils';
import ChartTooltip from '@/components/ChartTooltip';
import { useToast } from '@/components/ui/use-toast';
import { MonthlyData } from '@/types/investment';
import MetricsPanel from './MetricsPanel';

const GlobalManagedFundsChart = () => {
  const [data, setData] = useState<MonthlyData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState('1y');
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const calculateMetrics = (monthlyData: MonthlyData[]) => {
    const totalInvestment = monthlyData.reduce((sum, d) => sum + d.investment, 0);
    const totalProfit = monthlyData.reduce((sum, d) => sum + d.profit, 0);
    const portfolioValue = totalInvestment + totalProfit;
    const managementFees = totalInvestment * 0.005;
    const monthlyAverageInvestment = totalInvestment / monthlyData.length;
    const roi = (totalProfit / totalInvestment) * 100;

    return {
      totalInvestment,
      monthlyAverageInvestment,
      totalProfit,
      roi,
      managementFees,
      portfolioValue
    };
  };

  useEffect(() => {
    fetchGlobalFundsData();
  }, [dateRange]);

  const fetchGlobalFundsData = async () => {
    try {
      console.log('Fetching global funds data...');
      setIsLoading(true);
      
      const { data: monthlyData, error } = await supabase
        .from('monthly_performance')
        .select('*')
        .order('month', { ascending: true });

      if (error) {
        throw error;
      }

      if (!monthlyData || monthlyData.length === 0) {
        console.log('No data found');
        setData([]);
        setIsLoading(false);
        return;
      }

      // Transform the data to match MonthlyData type
      const transformedData: MonthlyData[] = monthlyData.map(item => ({
        month: item.month,
        expenses: item.expenses,
        investment: item.investment,
        portfolioValue: item.portfolio_value,
        profit: item.profit
      }));

      console.log('Processed global funds data:', transformedData);
      setData(transformedData);
    } catch (error) {
      console.error('Error fetching global funds data:', error);
      toast({
        title: "Error",
        description: "Failed to load chart data. Please try again later.",
        variant: "destructive",
      });
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) return [];

    const aggregated = aggregateMonthlyData(data);
    
    return [
      {
        id: 'Total Managed Funds',
        color: '#fbbf24',
        data: aggregated.map(d => ({
          x: d.date,
          y: d.totalManagedFunds,
        }))
      },
      {
        id: 'Cumulative Investment',
        color: '#3b82f6',
        data: aggregated.map(d => ({
          x: d.date,
          y: d.cumulativeInvestment,
        }))
      },
      {
        id: 'Cumulative Profit',
        color: '#22c55e',
        data: aggregated.map(d => ({
          x: d.date,
          y: d.cumulativeProfit,
        }))
      },
      {
        id: 'Management Fees',
        color: '#f97316',
        data: aggregated.map(d => ({
          x: d.date,
          y: d.managementFees,
        }))
      }
    ];
  }, [data]);

  const metrics = React.useMemo(() => {
    return calculateMetrics(data);
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
        <MetricsPanel {...metrics} />
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
                left: isMobile ? 40 : 60 
              }}
              xScale={{ type: 'point' }}
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
                format: (value) => value.toString()
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Amount (₪)',
                legendOffset: -40,
                legendPosition: 'middle',
                format: value => formatCurrency(value)
              }}
              enablePoints={false}
              enableArea={true}
              areaOpacity={0.1}
              enableGridX={true}
              enableGridY={true}
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
              tooltip={({ point }) => {
                const data = point.data as any;
                return <ChartTooltip data={data} />;
              }}
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
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalManagedFundsChart;