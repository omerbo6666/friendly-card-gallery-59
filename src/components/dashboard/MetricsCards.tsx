import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FundMetrics } from '@/types/dashboard';

interface MetricsCardsProps {
  metrics: FundMetrics;
}

export const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/30 border-indigo-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-300">Assets Under Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-indigo-200">
            ₪{Math.round(metrics.totalPortfolio || 0).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-violet-900/50 to-violet-800/30 border-violet-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-300">Total Fund Profit</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-violet-200">
            ₪{Math.round(metrics.totalProfit || 0).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-900/50 to-purple-800/30 border-purple-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-300">Management Fees (Annual)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-purple-200">
            ₪{Math.round((metrics.totalFees || 0) * 12).toLocaleString()}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-fuchsia-900/50 to-fuchsia-800/30 border-fuchsia-700/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-300">Fund ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-fuchsia-200">
            {metrics.avgROI || 0}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};