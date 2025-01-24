import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { format, parse, differenceInYears } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Play, ChartLine, TrendingUp, TrendingDown, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';

interface DataPoint {
  x: string;
  y: number;
  fullDate: string;
}

interface PerformanceChartProps {
  selectedTrack?: string;
}

const PerformanceChart = ({ selectedTrack }: PerformanceChartProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2000, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startDateInput, setStartDateInput] = useState(format(new Date(2000, 0, 1), 'yyyy-MM-dd'));
  const [endDateInput, setEndDateInput] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['SPY500', 'NASDAQ', 'RUSSELL2000']);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

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
        setFilteredData(formattedData);
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
        data: lineData,
        totalReturn: Number((cumulativeReturn - 100).toFixed(2)),
        annualizedReturn: Number(annualizedReturn)
      };
    });
  };

  const chartData = useMemo(() => {
    return filteredData.filter(track => selectedTracks.includes(track.trackId));
  }, [filteredData, selectedTracks]);

  return (
    <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-lg border border-border space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center gap-2">
          <ChartLine className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Index Performance Comparison</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          Historical performance shows the potential of long-term investment growth.
          Don't miss out on market opportunities - start investing today.
        </p>
      </div>

      <div className="h-[500px] bg-background/50 rounded-lg p-4 border border-border/50 overflow-hidden">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {chartData.map((series) => {
          const years = differenceInYears(new Date(), new Date(2000, 0, 1));
          return (
            <div 
              key={series.id} 
              className="bg-background/50 text-card-foreground rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: series.color }}
                    />
                    <h4 className="font-medium">
                      {series.id === 'SPY500' ? 'S&P 500' : 
                       series.id === 'RUSSELL2000' ? 'Russell 2000' : 
                       series.id}
                    </h4>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Return ({years} years)</span>
                    <span className={cn(
                      "font-semibold flex items-center gap-1",
                      series.totalReturn >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {series.totalReturn >= 0 ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {series.totalReturn >= 0 ? '+' : ''}{series.totalReturn}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Annual Return</span>
                    <span className={cn(
                      "font-semibold",
                      series.annualizedReturn >= 0 ? 'text-green-500' : 'text-red-500'
                    )}>
                      {series.annualizedReturn >= 0 ? '+' : ''}{series.annualizedReturn}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PerformanceChart;