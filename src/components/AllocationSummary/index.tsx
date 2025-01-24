import React from 'react';
import { Card } from "@/components/ui/card";
import { InvestmentAllocation } from '@/types/investment';
import { INVESTMENT_TRACKS } from '@/lib/constants';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface AllocationSummaryProps {
  allocations: InvestmentAllocation[];
}

const COLORS = ['#8B5CF6', '#0EA5E9', '#F97316'];

const AllocationSummary = ({ allocations }: AllocationSummaryProps) => {
  const data = allocations.map(allocation => ({
    name: INVESTMENT_TRACKS.find(track => track.id === allocation.trackId)?.name || allocation.trackId,
    value: allocation.percentage
  }));

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Allocation Summary</h3>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 gap-2 mt-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="text-sm">{item.name}</span>
            </div>
            <span className="font-medium">{item.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default AllocationSummary;