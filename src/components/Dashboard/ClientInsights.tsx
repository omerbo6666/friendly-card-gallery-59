import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Client } from '@/types/investment';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface ClientInsightsProps {
  client: Client;
}

export const ClientInsights: React.FC<ClientInsightsProps> = ({ client }) => {
  const calculateInsights = () => {
    const monthlyData = client.monthlyData;
    const totalInvestment = monthlyData.reduce((sum, data) => sum + data.investment, 0);
    const managementFee = totalInvestment * 0.005;
    const lastMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    
    const monthlyGrowth = previousMonth 
      ? ((lastMonth.portfolioValue - previousMonth.portfolioValue) / previousMonth.portfolioValue) * 100
      : 0;

    const averageInvestment = totalInvestment / monthlyData.length;

    return {
      managementFee,
      monthlyGrowth,
      averageInvestment,
      totalInvestment,
      currentValue: lastMonth.portfolioValue
    };
  };

  const insights = calculateInsights();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Client Insights</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Management Fee</p>
              <p className="font-medium">{formatCurrency(insights.managementFee)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {insights.monthlyGrowth >= 0 ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            <div>
              <p className="text-sm text-muted-foreground">Monthly Growth</p>
              <p className="font-medium">{insights.monthlyGrowth.toFixed(2)}%</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Average Monthly Investment</p>
            <p className="font-medium">{formatCurrency(insights.averageInvestment)}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Return</p>
            <p className="font-medium">
              {formatCurrency(insights.currentValue - insights.totalInvestment)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};