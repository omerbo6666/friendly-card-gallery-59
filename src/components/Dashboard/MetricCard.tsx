import React from 'react';
import { ArrowUpRight, ArrowDownRight, LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change: number;
}

export const MetricCard = ({ title, value, icon: Icon, change }: MetricCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-2 rounded-lg ${change >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="flex items-center">
        {change >= 0 ? 
          <ArrowUpRight className="w-4 h-4 text-green-500" /> : 
          <ArrowDownRight className="w-4 h-4 text-red-500" />
        }
        <span className={`ml-1 text-sm ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
          {Math.abs(change)}%
        </span>
      </div>
    </CardContent>
  </Card>
);