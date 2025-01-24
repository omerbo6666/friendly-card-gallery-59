import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { format, parse, differenceInYears } from 'date-fns';
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
  HelpCircle
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

const PerformanceChart = ({ selectedTrack, onTrackChange, showTrackSelector = true }: PerformanceChartProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['SPY500', 'NASDAQ', 'RUSSELL2000']);

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

  const processPerformanceData = (data: any[]) => {
    const indices = ['SPY500', 'NASDAQ100', 'RUSSELL2000'];
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
        data: lineData,
        totalReturn: Number((cumulativeReturn - 100).toFixed(2)),
        annualizedReturn: Number(annualizedReturn)
      };
    });
  };

  const chartData = useMemo(() => {
    return performanceData.filter(track => selectedTracks.includes(track.trackId));
  }, [performanceData, selectedTracks]);

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

  return (
    <div className="space-y-8">
      {/* Key Metrics Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-card/50 p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Total Investment</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground/70" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total amount invested across all tracks</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(1000000)}</div>
              <div className="text-sm text-muted-foreground">Monthly: {formatCurrency(50000)}</div>
            </div>
            <DollarSign className="w-5 h-5 text-primary/70" />
          </div>
        </div>

        <div className="bg-card/50 p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Portfolio Value</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground/70" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Current total value of your investments</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(1250000)}</div>
              <div className="text-sm text-muted-foreground">Fees: {formatCurrency(25000)}</div>
            </div>
            <PieChart className="w-5 h-5 text-primary/70" />
          </div>
        </div>

        <div className="bg-card/50 p-6 rounded-xl border border-border/50 hover:border-primary/20 transition-colors">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Total Profit</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="w-4 h-4 text-muted-foreground/70" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Net profit from your investments</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="text-2xl font-bold text-green-500">{formatCurrency(250000)}</div>
              <div className="text-sm text-muted-foreground">ROI: {calculateROI(1250000, 1000000)}%</div>
            </div>
            <Activity className="w-5 h-5 text-primary/70" />
          </div>
        </div>

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

      {/* Performance Chart Section */}
      <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-lg border border-border space-y-6">
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
    </div>
  );
};

export default PerformanceChart;
