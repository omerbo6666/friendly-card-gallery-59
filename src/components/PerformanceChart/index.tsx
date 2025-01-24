import React, { useState, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { format, parse } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Play, ChartLine, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DataPoint {
  x: string;
  y: number;
  fullDate: string;
}

const PerformanceChart = () => {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2000, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startDateInput, setStartDateInput] = useState(format(new Date(2000, 0, 1), 'yyyy-MM-dd'));
  const [endDateInput, setEndDateInput] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['SPY500', 'NASDAQ', 'RUSSELL2000']);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  React.useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    try {
      console.log('Fetching performance data...');
      const { data, error } = await supabase
        .from('index_performance')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      if (data) {
        console.log('Received data:', data.length, 'records');
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
      'SPY500': 'hsl(var(--primary))',
      'NASDAQ': 'hsl(var(--destructive))',
      'RUSSELL2000': 'hsl(var(--success))'
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

  const applyDateFilter = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Error",
        description: "Please select both start and end dates",
        variant: "destructive",
      });
      return;
    }

    console.log('Applying date filter:', { startDate, endDate });
    
    const filtered = performanceData.map(series => ({
      ...series,
      data: series.data.filter((point: DataPoint) => {
        const pointDate = parse(point.x, 'MMM yyyy', new Date());
        return pointDate >= startDate && pointDate <= endDate;
      })
    }));

    console.log('Filtered data:', filtered);
    setFilteredData(filtered);
  };

  const chartData = useMemo(() => {
    return filteredData.filter(track => selectedTracks.includes(track.trackId));
  }, [filteredData, selectedTracks]);

  return (
    <div className="bg-card text-card-foreground rounded-xl p-6 shadow-sm border border-border space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <ChartLine className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Index Performance Comparison</h3>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            {['SPY500', 'NASDAQ', 'RUSSELL2000'].map(trackId => (
              <Button
                key={trackId}
                variant={selectedTracks.includes(trackId) ? "default" : "outline"}
                onClick={() => toggleTrack(trackId)}
                className={cn(
                  "text-xs sm:text-sm transition-all flex items-center gap-2",
                  selectedTracks.includes(trackId) 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "hover:bg-accent"
                )}
              >
                <TrendingUp className="w-4 h-4" />
                {trackId === 'SPY500' ? 'S&P 500' : 
                 trackId === 'RUSSELL2000' ? 'Russell 2000' : 'NASDAQ'}
              </Button>
            ))}
          </div>
          
          <div className="grid gap-4 p-4 bg-background/50 rounded-lg border border-border">
            <div className="grid gap-2">
              <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDateInput}
                onChange={(e) => handleDateInputChange(e.target.value, setStartDate, setStartDateInput)}
                className="w-[160px] bg-background"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={endDateInput}
                onChange={(e) => handleDateInputChange(e.target.value, setEndDate, setEndDateInput)}
                className="w-[160px] bg-background"
              />
            </div>

            <Button 
              onClick={applyDateFilter}
              className="w-full"
              variant="default"
            >
              <Play className="w-4 h-4 mr-2" />
              Apply Filter
            </Button>
          </div>
        </div>
      </div>

      <div className="h-[400px] bg-background/50 rounded-lg p-4">
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
                stroke: 'hsl(var(--primary))',
                strokeWidth: 1,
                strokeOpacity: 0.5
              }
            },
            tooltip: {
              container: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                fontSize: 12,
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
          <div 
            key={series.id} 
            className="bg-background/50 text-card-foreground rounded-lg p-4 border border-border hover:border-primary/50 transition-colors"
          >
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
              <span className={cn(
                "font-semibold flex items-center gap-1",
                series.totalReturn >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {series.totalReturn >= 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {series.totalReturn >= 0 ? '+' : ''}{series.totalReturn}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceChart;
