import React, { useState, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { format, parse } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PerformanceChartProps {
  spyReturns: number[];
  vtiReturns: number[];
  nasdaqReturns: number[];
}

interface DataPoint {
  x: string;
  y: number;
  fullDate: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = () => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2000, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startDateInput, setStartDateInput] = useState(format(new Date(2000, 0, 1), 'yyyy-MM-dd'));
  const [endDateInput, setEndDateInput] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['SPY500', 'NASDAQ', 'RUSSELL2000']);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  React.useEffect(() => {
    fetchPerformanceData();
  }, [startDate, endDate]);

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
    }
  };

  const processPerformanceData = (data: any[]) => {
    const indices = ['SPY500', 'NASDAQ', 'RUSSELL2000'];
    const colors = {
      'SPY500': '#8B5CF6',
      'NASDAQ': '#F97316',
      'RUSSELL2000': '#10B981'
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

      return {
        id: index,
        trackId: index,
        color: colors[index as keyof typeof colors],
        data: lineData,
        totalReturn: Number((cumulativeReturn - 100).toFixed(2))
      };
    });
  };

  const handleDateInputChange = (value: string, setDate: (date: Date | undefined) => void, setInput: (value: string) => void) => {
    setInput(value);
    const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
    if (!isNaN(parsedDate.getTime())) {
      setDate(parsedDate);
    }
  };

  const toggleTrack = (trackId: string) => {
    setSelectedTracks(prev => 
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const chartData = useMemo(() => {
    return performanceData.filter(track => selectedTracks.includes(track.trackId));
  }, [performanceData, selectedTracks]);

  return (
    <div className="bg-card text-card-foreground rounded-xl p-4 shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold">Index Performance Comparison</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            {['SPY500', 'NASDAQ', 'RUSSELL2000'].map(trackId => (
              <Button
                key={trackId}
                variant={selectedTracks.includes(trackId) ? "default" : "outline"}
                onClick={() => toggleTrack(trackId)}
                className={cn(
                  "text-xs sm:text-sm transition-all",
                  selectedTracks.includes(trackId) 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "hover:bg-accent"
                )}
              >
                {trackId === 'SPY500' ? 'S&P 500' : 
                 trackId === 'RUSSELL2000' ? 'Russell 2000' : 'NASDAQ'}
              </Button>
            ))}
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="grid gap-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="flex gap-2">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDateInput}
                    onChange={(e) => handleDateInputChange(e.target.value, setStartDate, setStartDateInput)}
                    className="w-[160px] bg-background"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[40px] p-0 bg-background",
                          !startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          if (date) setStartDateInput(format(date, 'yyyy-MM-dd'));
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="grid gap-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="flex gap-2">
                  <Input
                    id="endDate"
                    type="date"
                    value={endDateInput}
                    onChange={(e) => handleDateInputChange(e.target.value, setEndDate, setEndDateInput)}
                    className="w-[160px] bg-background"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[40px] p-0 bg-background",
                          !endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          if (date) setEndDateInput(format(date, 'yyyy-MM-dd'));
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveLine
          data={chartData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
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
            legendOffset: 36,
            legendPosition: 'middle',
            format: (value) => value?.toString() || ''
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Percentage Change (%)',
            legendOffset: -40,
            legendPosition: 'middle',
            format: value => `${value.toFixed(2)}%`
          }}
          enablePoints={true}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableArea={true}
          areaOpacity={0.15}
          useMesh={true}
          enableSlices="x"
          crosshairType="cross"
          theme={{
            axis: {
              ticks: {
                text: {
                  fontSize: 11,
                  fill: 'hsl(var(--muted-foreground))'
                }
              },
              legend: {
                text: {
                  fontSize: 12,
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
                fontSize: 12,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                padding: '6px 10px',
                border: '1px solid hsl(var(--border))'
              }
            }
          }}
          tooltip={({ point }) => {
            const data = point.data as unknown as DataPoint;
            return (
              <div className="bg-popover text-popover-foreground rounded-lg shadow-lg p-2 text-sm">
                <div className="font-semibold">{data.fullDate}</div>
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: point.serieColor }}
                  />
                  <span>{point.serieId}: {data.y}%</span>
                </div>
              </div>
            );
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {chartData.map((series) => (
          <Card key={series.id} className="p-4">
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
              <span className={`font-semibold ${
                series.totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {series.totalReturn >= 0 ? '+' : ''}{series.totalReturn}%
              </span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;