import React from 'react';
import { TooltipProps } from 'recharts';

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: any[];
  label?: string;
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <p className="text-gray-400">Month {label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-gray-200">
            {entry.name}: ₪{Math.round(entry.value).toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};