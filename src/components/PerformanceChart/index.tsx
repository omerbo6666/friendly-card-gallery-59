import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { format, parse, differenceInYears, subMonths, isAfter } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { 
  ChartLine, 
  TrendingUp, 
  TrendingDown, 
  Calendar,
  DollarSign,
  PieChart,
  Activity,
  HelpCircle,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Wallet,
  LineChart
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import TrackSelector from '../ClientDetails/TrackSelector';
import { InvestmentTrack } from '@/types/investment';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DataPoint {
  x: string;
  y: number;
  fullDate: string;
}

interface PerformanceChartProps {
  selectedTrack?: string;
  onTrackChange?: (track: InvestmentTrack) => void;
  showTrackSelector?: boolean;
}

type TimePeriod = '1M' | '3M' | '6M' | '1Y' | '5Y' | 'ALL';

const PerformanceChart = ({ selectedTrack, onTrackChange, showTrackSelector = true }: PerformanceChartProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['SPY500', 'NASDAQ', 'RUSSELL2000']);
  const [timeRange, setTimeRange] = useState<TimePeriod>('1Y');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  useEffect(() => {
    if (selectedTrack) {
      setSelectedTracks([selectedTrack]);
    }
  }, [selectedTrack]);

  const fetchPerformanceData = async () => {
    try {
      const { data, error } = await supabase
        .from('index_performance')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedData = processPerformanceData(data);
        setPerformanceData(formattedData);
      }
    } catch (error) {
      console.error('Error fetching performance data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch performance data",
        variant: "destructive",
      });
    }
  };

  const filterDataByTimeRange = (data: DataPoint[], range: TimePeriod): DataPoint[] => {
    const now = new Date();
    let filterDate = now;

    switch (range) {
      case '1M':
        filterDate = subMonths(now, 1);
        break;
      case '3M':
        filterDate = subMonths(now, 3);
        break;
      case '6M':
        filterDate = subMonths(now, 6);
        break;
      case '1Y':
        filterDate = subMonths(now, 12);
        break;
      case '5Y':
        filterDate = subMonths(now, 60);
        break;
      case 'ALL':
      default:
        return data;
    }

    return data.filter(point => {
      const pointDate = parse(point.fullDate, 'MMMM yyyy', new Date());
      return isAfter(pointDate, filterDate);
    });
  };

  const processPerformanceData = (data: any[]) => {
    const indices = ['SPY500', 'NASDAQ', 'RUSSELL2000'];
    const colors = {
      'SPY500': '#22c55e',
      'NASDAQ': '#ec4899',
      'RUSSELL2000': '#8b5cf6'
    };

    return indices.map(index => {
      const indexData = data.filter(d => d.index_name === index);
      let cumulativeReturn = 100;
      
      const lineData = indexData.map(d => {
        cumulativeReturn *= (1 + d.monthly_return);
        return {
          x: format(new Date(d.date), 'MMM yyyy'),
          y: Number(((cumulativeReturn - 100)).toFixed(2)),
          fullDate: format(new Date(d.date), 'MMMM yyyy')
        };
      });

      const years = differenceInYears(new Date(), new Date(2000, 0, 1));
      const annualizedReturn = ((Math.pow(1 + (lineData[lineData.length - 1]?.y || 0) / 100, 1 / years) - 1) * 100).toFixed(2);

      return {
        id: index,
        trackId: index,
        color: colors[index as keyof typeof colors],
        data: filterDataByTimeRange(lineData, timeRange),
        totalReturn: Number((cumulativeReturn - 100).toFixed(2)),
        annualizedReturn: Number(annualizedReturn)
      };
    });
  };

  const chartData = useMemo(() => {
    return performanceData.filter(track => selectedTracks.includes(track.trackId));
  }, [performanceData, selectedTracks, timeRange]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateROI = (totalValue: number, totalInvestment: number): string => {
    return ((totalValue - totalInvestment) / totalInvestment * 100).toFixed(2);
  };

  const MetricCard = ({ title, value, subValue, icon: Icon, trend, tooltipContent }: any) => (
    <Card className="bg-card/50 hover:bg-card/70 transition-colors">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
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
            </div>
            <div className="text-2xl font-bold flex items-center gap-2">
              {value}
              {trend && (
                <span className={cn(
                  "text-sm font-medium flex items-center",
                  trend > 0 ? "text-green-500" : "text-red-500"
                )}>
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
      </CardHeader>
    </Card>
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Investment"
          value={formatCurrency(1000000)}
          subValue={`Monthly: ${formatCurrency(50000)}`}
          icon={Wallet}
          tooltipContent="Total amount invested across all tracks"
        />
        
        <MetricCard
          title="Portfolio Value"
          value={formatCurrency(1250000)}
          subValue={`Fees: ${formatCurrency(25000)}`}
          icon={DollarSign}
          trend={5.2}
          tooltipContent="Current total value of your investments"
        />
        
        <MetricCard
          title="Total Profit"
          value={formatCurrency(250000)}
          subValue={`ROI: ${calculateROI(1250000, 1000000)}%`}
          icon={LineChart}
          trend={12.5}
          tooltipContent="Net profit from your investments"
        />

        <div className="bg-card/50 p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Investment Track</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground/70" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Your selected investment strategy</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <TrendingUp className="w-5 h-5 text-primary/70" />
            </div>
            {showTrackSelector && onTrackChange && selectedTrack && (
              <TrackSelector
                selectedTrack={selectedTrack as InvestmentTrack}
                onTrackChange={onTrackChange}
              />
            )}
          </div>
        </div>
      </div>

      <Card className="bg-card text-card-foreground rounded-xl shadow-lg border border-border">
        <CardHeader className="p-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>Track performance across different indices</CardDescription>
          </div>
          <div className="flex gap-2">
            {(['1M', '3M', '6M', '1Y', '5Y', 'ALL'] as TimePeriod[]).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setTimeRange(range);
                  const newData = processPerformanceData(performanceData);
                  setPerformanceData(newData);
                }}
              >
                {range}
              </Button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[400px]">
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
              yFormat=" >-.2f"
              curve="monotoneX"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Timeline',
                legendOffset: 50,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Total Return (%)',
                legendOffset: -40,
                legendPosition: 'middle',
                format: value => `${value.toFixed(0)}%`
              }}
              enablePoints={false}
              lineWidth={1.5}
              enableArea={true}
              areaOpacity={0.1}
              useMesh={true}
              enableSlices="x"
              crosshairType="cross"
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
                },
                tooltip: {
                  container: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    fontSize: isMobile ? 11 : 12,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    padding: '8px 12px',
                    border: '1px solid hsl(var(--border))'
                  }
                }
              }}
              tooltip={({ point }) => {
                const data = point.data as unknown as DataPoint;
                return (
                  <div className="bg-popover text-popover-foreground rounded-lg shadow-lg p-3 space-y-2">
                    <div className="font-semibold border-b border-border pb-2">{data.fullDate}</div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: point.serieColor }}
                      />
                      <span className="font-medium">{point.serieId}</span>
                      <span className={cn(
                        "font-semibold ml-2",
                        data.y >= 0 ? "text-green-500" : "text-red-500"
                      )}>
                        {data.y >= 0 ? "+" : ""}{data.y}%
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceChart;
