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
  ResponsiveContainer,
  Brush
} from "recharts";
import { Label } from "@/components/ui/label";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { INVESTMENT_TRACKS } from "@/lib/constants";
import { Toggle } from "@/components/ui/toggle";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const [selectedTracks, setSelectedTracks] = useState<Set<string>>(
    new Set(INVESTMENT_TRACKS.map(track => track.id))
  );

  const toggleTrack = (trackId: string) => {
    const newSelectedTracks = new Set(selectedTracks);
    if (newSelectedTracks.has(trackId)) {
      newSelectedTracks.delete(trackId);
    } else {
      newSelectedTracks.add(trackId);
    }
    setSelectedTracks(newSelectedTracks);
    console.log(`Toggled track ${trackId}, now selected: ${Array.from(newSelectedTracks)}`);
  };

  const formatData = () => {
    const tracks = INVESTMENT_TRACKS.map(track => ({
      id: track.id,
      name: track.name,
      color: getTrackColor(track.id)
    }));

    const data = [];
    let currentDate = dateRange.from;
    
    while (currentDate && dateRange.to && currentDate <= dateRange.to) {
      const dataPoint: any = {
        date: format(currentDate, 'yyyy-MM-dd')
      };
      
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
      SPY: '#FEF7CD',    // Soft Yellow
      QQQ: '#FEC6A1',    // Soft Orange
      IWM: '#E5DEFF',    // Soft Purple
      VTSAX: '#FDE1D3',  // Soft Peach
      VTI: '#F2FCE2',    // Soft Green
      SWTSX: '#F1F0FB',  // Soft Gray
      IWV: '#E5DEFF',    // Soft Purple
      WFIVX: '#FDE1D3'   // Soft Peach
    };
    return colors[trackId] || '#F1F0FB';
  };

  const calculatePerformance = (trackId: string, date: Date): number => {
    return Math.random() * 20 - 10;
  };

  const calculateTotalPerformance = (trackId: string): number => {
    return Math.random() * 100 - 20;
  };

  const { data, tracks } = formatData();

  return (
    <Card className="p-4 md:p-6 bg-[#1A1F2C] border-none">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <h3 className="text-lg font-semibold text-gray-200">Index Performance Comparison</h3>
          <DateRangePicker
            from={dateRange.from}
            to={dateRange.to}
            onSelect={setDateRange}
          />
        </div>

        <ScrollArea className="w-full">
          <div className="flex flex-wrap gap-2 p-2 min-w-[600px]">
            {tracks.map((track) => (
              <Toggle
                key={track.id}
                pressed={selectedTracks.has(track.id)}
                onPressedChange={() => toggleTrack(track.id)}
                className="data-[state=on]:bg-gray-700/50 data-[state=on]:text-gray-200 bg-gray-800/50 text-gray-400"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: track.color }}
                  />
                  <span>{track.name}</span>
                </div>
              </Toggle>
            ))}
          </div>
        </ScrollArea>

        <div className="h-[600px] md:h-[700px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(255,255,255,0.1)" 
                horizontal={true}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(parseISO(date), 'MMM yyyy')}
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#6B7280' }}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                stroke="#6B7280"
                tick={{ fill: '#6B7280' }}
                tickLine={{ stroke: '#6B7280' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(17, 24, 39, 0.8)",
                  border: "1px solid rgba(75, 85, 99, 0.4)",
                  borderRadius: "6px",
                  color: "#E5E7EB"
                }}
                formatter={(value: number) => [`${value.toFixed(2)}%`]}
                labelFormatter={(label) => format(parseISO(label as string), 'MMMM yyyy')}
              />
              {tracks
                .filter(track => selectedTracks.has(track.id))
                .map((track) => (
                  <Line
                    key={track.id}
                    type="monotone"
                    dataKey={track.id}
                    name={track.name}
                    stroke={track.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: track.color }}
                  />
              ))}
              <Brush
                dataKey="date"
                height={30}
                stroke="#4B5563"
                fill="#1F2937"
                tickFormatter={(date) => format(parseISO(date), 'MMM yyyy')}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {tracks
            .filter(track => selectedTracks.has(track.id))
            .map((track) => (
              <div
                key={track.id}
                className="p-4 rounded-lg border border-gray-700 bg-gray-800/50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: track.color }}
                  />
                  <span className="text-sm font-medium text-gray-200">{track.name}</span>
                </div>
                <div className="mt-2 text-lg font-bold text-gray-200">
                  {calculateTotalPerformance(track.id).toFixed(2)}%
                </div>
              </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default PerformanceChart;