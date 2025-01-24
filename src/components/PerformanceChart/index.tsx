import React, { useState, useMemo, useEffect } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { format, parse, differenceInYears } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChartLine, TrendingUp, TrendingDown, Calendar, DollarSign, PiggyBank, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from '@/hooks/use-mobile';
import TrackSelector from '../ClientDetails/TrackSelector';
import { InvestmentTrack } from '@/types/investment';

interface DataPoint {
  x: string;
  y: number;
  fullDate: string;
  expenses?: number;
  investment?: number;
  totalValue?: number;
}

interface PerformanceChartProps {
  selectedTrack?: string;
  onTrackChange?: (track: InvestmentTrack) => void;
  showTrackSelector?: boolean;
  clientId?: string;
}

const PerformanceChart = ({ selectedTrack, onTrackChange, showTrackSelector = true, clientId }: PerformanceChartProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [clientData, setClientData] = useState<any[]>([]);
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['SPY500', 'NASDAQ', 'RUSSELL2000']);

  useEffect(() => {
    fetchPerformanceData();
    if (clientId) {
      fetchClientData();
    }
  }, [clientId]);

  useEffect(() => {
    if (selectedTrack) {
      setSelectedTracks([selectedTrack]);
    }
  }, [selectedTrack]);

  const fetchClientData = async () => {
    try {
      const { data, error } = await supabase
        .from('monthly_performance')
        .select('*')
        .eq('client_id', clientId)
        .order('month', { ascending: true });

      if (error) throw error;

      if (data) {
        const processedData = processClientData(data);
        setClientData(processedData);
      }
    } catch (error) {
      console.error('Error fetching client data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch client performance data",
        variant: "destructive",
      });
    }
  };

  const processClientData = (data: any[]) => {
    let cumulativeExpenses = 0;
    let cumulativeInvestment = 0;

    const expensesLine = {
      id: 'Cumulative Expenses',
      color: '#ef4444', // red-500
      data: data.map(d => {
        cumulativeExpenses += d.expenses;
        return {
          x: `Month ${d.month}`,
          y: cumulativeExpenses,
          expenses: d.expenses,
          fullDate: `Month ${d.month}`
        };
      })
    };

    const investmentLine = {
      id: 'Cumulative Investment',
      color: '#0ea5e9', // sky-500
      data: data.map(d => {
        cumulativeInvestment += d.investment;
        return {
          x: `Month ${d.month}`,
          y: cumulativeInvestment,
          investment: d.investment,
          fullDate: `Month ${d.month}`
        };
      })
    };

    const totalValueLine = {
      id: 'Investment + Profit',
      color: '#22c55e', // green-500
      data: data.map(d => ({
        x: `Month ${d.month}`,
        y: d.portfolio_value,
        totalValue: d.portfolio_value,
        fullDate: `Month ${d.month}`
      }))
    };

    return [expensesLine, investmentLine, totalValueLine];
  };

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
    if (clientId && clientData.length > 0) {
      return clientData;
    }
    return performanceData.filter(track => selectedTracks.includes(track.trackId));
  }, [performanceData, selectedTracks, clientData, clientId]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl p-4 md:p-6 shadow-lg border border-border space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChartLine className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold">
              {clientId ? 'Client Performance Overview' : 'Index Performance Comparison'}
            </h3>
          </div>
          {showTrackSelector && onTrackChange && selectedTrack && !clientId && (
            <div className="w-[200px]">
              <TrackSelector
                selectedTrack={selectedTrack as InvestmentTrack}
                onTrackChange={onTrackChange}
              />
            </div>
          )}
        </div>
        <p className="text-muted-foreground text-sm">
          {clientId 
            ? 'Track your investment progress, expenses, and portfolio value over time.'
            : 'Historical performance shows the potential of long-term investment growth.'}
        </p>
      </div>

      <div className="h-[500px] bg-background/50 rounded-lg p-4 border border-border/50">
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
            legend: clientId ? 'Amount (₪)' : 'Total Return (%)',
            legendOffset: -40,
            legendPosition: 'middle',
            format: value => clientId ? `₪${value.toLocaleString()}` : `${value.toFixed(0)}%`
          }}
          enablePoints={false}
          lineWidth={1.5}
          enableArea={true}
          areaOpacity={0.1}
          useMesh={true}
          enableSlices="x"
          crosshairType="cross"
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
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
                <div className="space-y-1">
                  {data.expenses !== undefined && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-red-500" />
                      <span>Expenses: {formatCurrency(data.expenses)}</span>
                    </div>
                  )}
                  {data.investment !== undefined && (
                    <div className="flex items-center gap-2">
                      <PiggyBank className="w-4 h-4 text-sky-500" />
                      <span>Investment: {formatCurrency(data.investment)}</span>
                    </div>
                  )}
                  {data.totalValue !== undefined && (
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-green-500" />
                      <span>Total Value: {formatCurrency(data.totalValue)}</span>
                    </div>
                  )}
                  {!clientId && (
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
                  )}
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
