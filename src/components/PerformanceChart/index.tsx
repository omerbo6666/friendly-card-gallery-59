import React, { useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { format } from 'date-fns';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PerformanceChartProps {
  spyReturns: number[];
  vtiReturns: number[];
  nasdaqReturns: number[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ spyReturns, vtiReturns, nasdaqReturns }) => {
  const [selectedTrack, setSelectedTrack] = useState('SPY500');
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(2019, 0, 1));
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());

  const calculateCumulativeReturns = (returns: number[], start: Date, end: Date) => {
    const startIndex = Math.max(0, returns.length - Math.ceil((end.getTime() - start.getTime()) / (30 * 24 * 60 * 60 * 1000)));
    const relevantReturns = returns.slice(startIndex);
    
    let cumulativeValue = 100; // Start with base value of 100
    return relevantReturns.map((monthlyReturn, index) => {
      cumulativeValue *= (1 + monthlyReturn);
      const date = new Date(start);
      date.setMonth(date.getMonth() + index);
      
      return {
        x: format(date, 'MMM yyyy'),
        y: ((cumulativeValue - 100) / 100) * 100 // Convert to percentage change
      };
    });
  };

  const getReturnsData = () => {
    if (!startDate || !endDate) return [];
    
    const returns = selectedTrack === 'SPY500' ? spyReturns :
                   selectedTrack === 'VTI' ? vtiReturns :
                   nasdaqReturns;
                   
    return [{
      id: selectedTrack,
      data: calculateCumulativeReturns(returns, startDate, endDate)
    }];
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl p-4 shadow-sm border border-border">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="text-lg font-semibold">Performance Since Inception</h3>
        <div className="flex flex-wrap gap-4">
          <Select value={selectedTrack} onValueChange={setSelectedTrack}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SPY500">S&P 500</SelectItem>
              <SelectItem value="VTI">VTI</SelectItem>
              <SelectItem value="NASDAQ100">NASDAQ</SelectItem>
            </SelectContent>
          </Select>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {startDate ? format(startDate, 'PP') : 'Pick start date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                {endDate ? format(endDate, 'PP') : 'Pick end date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="h-[400px]">
        <ResponsiveLine
          data={getReturnsData()}
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
          pointSize={10}
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
        />
      </div>
    </div>
  );
};

export default PerformanceChart;