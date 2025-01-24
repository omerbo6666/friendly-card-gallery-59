import React, { useState, useMemo } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { format, parse } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RUSSELL2000_RETURNS } from '@/lib/utils';
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface PerformanceChartProps {
  spyReturns: number[];
  vtiReturns: number[];
  nasdaqReturns: number[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ spyReturns, vtiReturns, nasdaqReturns }) => {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2019, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [startDateInput, setStartDateInput] = useState(format(new Date(2019, 0, 1), 'yyyy-MM-dd'));
  const [endDateInput, setEndDateInput] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedTracks, setSelectedTracks] = useState<string[]>(['SPY500', 'NASDAQ', 'RUSSELL2000']);

  const handleDateInputChange = (value: string, setDate: (date: Date | undefined) => void, setInput: (value: string) => void) => {
    setInput(value);
    const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
    if (!isNaN(parsedDate.getTime())) {
      setDate(parsedDate);
    }
  };

  const calculateCumulativeReturns = (returns: number[], start: Date, end: Date) => {
    const startIndex = Math.max(0, returns.length - Math.ceil((end.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000)));
    const relevantReturns = returns.slice(startIndex);
    
    let cumulativeValue = 100;
    return {
      data: relevantReturns.map((monthlyReturn, index) => {
        cumulativeValue *= (1 + monthlyReturn);
        const date = new Date(start);
        date.setMonth(date.getMonth() + index);
        
        return {
          x: format(date, 'MMM yyyy'),
          y: Number(((cumulativeValue - 100) / 100 * 100).toFixed(2))
        };
      }),
      totalReturn: Number(((cumulativeValue - 100) / 100 * 100).toFixed(2))
    };
  };

  const toggleTrack = (trackId: string) => {
    setSelectedTracks(prev => 
      prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId]
    );
  };

  const chartData = useMemo(() => {
    if (!startDate || !endDate) return [];
    
    const spyData = calculateCumulativeReturns(spyReturns, startDate, endDate);
    const nasdaqData = calculateCumulativeReturns(nasdaqReturns, startDate, endDate);
    const russell2000Data = calculateCumulativeReturns(RUSSELL2000_RETURNS, startDate, endDate);
    
    const allData = [
      {
        id: "S&P 500",
        trackId: "SPY500",
        color: "#8B5CF6",
        data: spyData.data,
        totalReturn: spyData.totalReturn
      },
      {
        id: "NASDAQ",
        trackId: "NASDAQ",
        color: "#F97316",
        data: nasdaqData.data,
        totalReturn: nasdaqData.totalReturn
      },
      {
        id: "Russell 2000",
        trackId: "RUSSELL2000",
        color: "#10B981",
        data: russell2000Data.data,
        totalReturn: russell2000Data.totalReturn
      }
    ];

    return allData.filter(track => selectedTracks.includes(track.trackId));
  }, [spyReturns, nasdaqReturns, startDate, endDate, selectedTracks]);

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
                className="text-xs sm:text-sm"
              >
                {trackId === 'SPY500' ? 'S&P 500' : 
                 trackId === 'RUSSELL2000' ? 'Russell 2000' : trackId}
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
                    className="w-[160px]"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[40px] p-0",
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
                    className="w-[160px]"
                  />
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[40px] p-0",
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
            legendPosition: 'middle'
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
          enablePoints={false}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          enableArea={true}
          areaOpacity={0.15}
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
            }
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
                <h4 className="font-medium">{series.id}</h4>
              </div>
              <span className={`font-semibold ${
                series.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'
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