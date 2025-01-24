import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { format, parseISO, subMonths } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { INVESTMENT_TRACKS } from "@/lib/constants";

interface PerformanceChartProps {
  startDate?: Date;
  endDate?: Date;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({
  startDate = subMonths(new Date(), 12),
  endDate = new Date()
}) => {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: startDate,
    to: endDate
  });

  const formatData = () => {
    // Get all investment tracks
    const tracks = INVESTMENT_TRACKS.map(track => ({
      id: track.id,
      name: track.name,
      color: getTrackColor(track.id)
    }));

    // Create data points for each month
    const data = [];
    let currentDate = dateRange.from;
    
    while (currentDate && dateRange.to && currentDate <= dateRange.to) {
      const dataPoint: any = {
        date: format(currentDate, 'yyyy-MM-dd')
      };
      
      // Add performance data for each track
      tracks.forEach(track => {
        dataPoint[track.id] = calculatePerformance(track.id, currentDate);
      });
      
      data.push(dataPoint);
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }

    return { data, tracks };
  };

  const getTrackColor = (trackId: string): string => {
    const colors: { [key: string]: string } = {
      SPY: '#8884d8',
      QQQ: '#82ca9d',
      IWM: '#ffc658',
      VTSAX: '#ff7300',
      VTI: '#00C49F',
      SWTSX: '#FFBB28',
      IWV: '#FF8042',
      WFIVX: '#e91e63'
    };
    return colors[trackId] || '#999999';
  };

  const calculatePerformance = (trackId: string, date: Date): number => {
    // This would be replaced with actual historical performance data
    // For now, returning mock data
    return Math.random() * 20 - 10;
  };

  const calculateTotalPerformance = (trackId: string): number => {
    // Calculate total performance for the selected date range
    return Math.random() * 100 - 20; // Mock data
  };

  const { data, tracks } = formatData();

  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h3 className="text-lg font-semibold">Index Performance Comparison</h3>
        <DateRangePicker
          from={dateRange.from}
          to={dateRange.to}
          onSelect={setDateRange}
        />
      </div>

      <div className="h-[400px] md:h-[500px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), 'MMM yyyy')}
            />
            <YAxis
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}%`]}
              labelFormatter={(label) => format(parseISO(label as string), 'MMMM yyyy')}
            />
            <Legend />
            {tracks.map((track) => (
              <Line
                key={track.id}
                type="monotone"
                dataKey={track.id}
                name={track.name}
                stroke={track.color}
                dot={false}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="p-4 rounded-lg border border-border bg-card"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: track.color }}
              />
              <span className="text-sm font-medium">{track.name}</span>
            </div>
            <div className="mt-2 text-lg font-bold">
              {calculateTotalPerformance(track.id).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PerformanceChart;