import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Coins, BarChart3 } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCurrency } from '@/utils/chartDataUtils';

interface MetricsPanelProps {
  totalInvestment: number;
  monthlyAverageInvestment: number;
  totalProfit: number;
  roi: number;
  managementFees: number;
  portfolioValue: number;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({
  totalInvestment,
  monthlyAverageInvestment,
  totalProfit,
  roi,
  managementFees,
  portfolioValue,
}) => {
  const metrics = [
    {
      title: "Total Investment",
      value: formatCurrency(totalInvestment),
      subValue: `Monthly Average: ${formatCurrency(monthlyAverageInvestment)}`,
      icon: DollarSign,
      tooltip: "Total amount invested across all clients and average monthly investment",
      color: "text-blue-500"
    },
    {
      title: "Total Profit",
      value: formatCurrency(totalProfit),
      subValue: `ROI: ${roi.toFixed(2)}%`,
      icon: TrendingUp,
      tooltip: "Cumulative profit and Return on Investment percentage",
      color: "text-green-500"
    },
    {
      title: "Management Fees",
      value: formatCurrency(managementFees),
      icon: Coins,
      tooltip: "Total profit earned from management fees (0.5% of investments)",
      color: "text-orange-500"
    },
    {
      title: "Portfolio Value",
      value: formatCurrency(portfolioValue),
      icon: BarChart3,
      tooltip: "Total managed funds (Investments + Profit)",
      color: "text-yellow-500"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-card">
          <CardContent className="pt-6">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">
                        {metric.title}
                      </p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      {metric.subValue && (
                        <p className="text-sm text-muted-foreground">
                          {metric.subValue}
                        </p>
                      )}
                    </div>
                    <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">{metric.tooltip}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsPanel;