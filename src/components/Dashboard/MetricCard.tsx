import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
}

export const MetricCard = ({ title, value, change }: MetricCardProps) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <h3 className="text-sm text-gray-500">{title}</h3>
    <div className="text-2xl font-bold mt-1">{value}</div>
    <div className={`text-sm mt-2 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
      {change}
    </div>
  </div>
);