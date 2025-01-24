import React from 'react';
import { Wallet, PiggyBank, TrendingUp, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/chartDataUtils';

interface ChartTooltipProps {
  data: {
    date: string;
    totalManagedFunds: number;
    cumulativeInvestment: number;
    cumulativeProfit: number;
    managementFees: number;
  };
}

const ChartTooltip: React.FC<ChartTooltipProps> = ({ data }) => {
  return (
    <div className="bg-popover text-popover-foreground rounded-lg shadow-lg p-3 space-y-2">
      <div className="font-semibold border-b border-border pb-2">{data.date}</div>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Wallet className="w-4 h-4 text-cyan-500" />
          <span>Total Managed Funds: {formatCurrency(data.totalManagedFunds)}</span>
        </div>
        <div className="flex items-center gap-2">
          <PiggyBank className="w-4 h-4 text-sky-500" />
          <span>Cumulative Investment: {formatCurrency(data.cumulativeInvestment)}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          <span>Cumulative Profit: {formatCurrency(data.cumulativeProfit)}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-purple-500" />
          <span>Management Fees: {formatCurrency(data.managementFees)}</span>
        </div>
      </div>
    </div>
  );
};

export default ChartTooltip;