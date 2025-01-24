import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, PiggyBank, TrendingUp, Coins } from 'lucide-react';
import { formatCurrency } from '@/utils/chartDataUtils';

interface MetricsPanelProps {
  totalClients: number;
  totalManagedFunds: number;
  totalProfit: number;
  managementFees: number;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({
  totalClients,
  totalManagedFunds,
  totalProfit,
  managementFees,
}) => {
  const metrics = [
    {
      title: "Total Clients",
      value: totalClients.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      subtext: "Active portfolios"
    },
    {
      title: "Total Managed Funds",
      value: formatCurrency(totalManagedFunds),
      icon: PiggyBank,
      color: "text-yellow-500",
      subtext: "Assets under management"
    },
    {
      title: "Total Profit",
      value: formatCurrency(totalProfit),
      icon: TrendingUp,
      color: "text-green-500",
      subtext: "Cumulative returns"
    },
    {
      title: "Management Fees",
      value: formatCurrency(managementFees),
      icon: Coins,
      color: "text-orange-500",
      subtext: "Total fees collected"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, index) => (
        <Card key={index} className="bg-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-muted-foreground">
                  {metric.title}
                </p>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">
                  {metric.subtext}
                </p>
              </div>
              <metric.icon className={`h-5 w-5 ${metric.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MetricsPanel;