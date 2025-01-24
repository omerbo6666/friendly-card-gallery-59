import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChartLine } from 'lucide-react';
import {
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ChartControlsProps {
  dateRange: string;
  onDateRangeChange: (value: string) => void;
}

const ChartControls: React.FC<ChartControlsProps> = ({
  dateRange,
  onDateRangeChange,
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <ChartLine className="w-5 h-5 text-primary" />
        <CardTitle className="text-2xl font-bold">
          Global Managed Funds Overview
        </CardTitle>
      </div>
      <Select
        value={dateRange}
        onValueChange={onDateRangeChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1m">Last Month</SelectItem>
          <SelectItem value="6m">Last 6 Months</SelectItem>
          <SelectItem value="1y">Last Year</SelectItem>
          <SelectItem value="2y">Last 2 Years</SelectItem>
          <SelectItem value="all">All Time</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ChartControls;