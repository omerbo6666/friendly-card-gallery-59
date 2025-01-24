import React, { useState, useEffect } from 'react';
import { Client, ClientMetrics, InvestmentTrack } from '@/types/investment';
import { Card } from "@/components/ui/card";
import {
  TrendingUp,
  DollarSign,
  PieChart,
  Activity,
} from 'lucide-react';
import MetricCard from './MetricCard';
import TrackSelector from './TrackSelector';
import PerformanceChart from '@/components/PerformanceChart';

interface ClientDetailsProps {
  client: Client;
  metrics: ClientMetrics;
}

const ClientDetails = ({ client, metrics }: ClientDetailsProps) => {
  const [selectedTrack, setSelectedTrack] = useState<InvestmentTrack>(client.investmentTrack);

  useEffect(() => {
    setSelectedTrack(client.investmentTrack);
  }, [client]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const calculateROI = () => {
    return ((metrics.totalProfit / metrics.totalInvestment) * 100).toFixed(2);
  };

  const handleTrackChange = (track: InvestmentTrack) => {
    setSelectedTrack(track);
  };

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Investment"
          value={formatCurrency(metrics.totalInvestment)}
          subValue={`Monthly: ${formatCurrency(metrics.latestMonthlyInvestment)}`}
          icon={DollarSign}
          tooltipContent="Total amount invested since the beginning"
        />
        <MetricCard
          title="Portfolio Value"
          value={formatCurrency(metrics.portfolioValue)}
          subValue={`Management Fee: ${formatCurrency(metrics.managementFee)}`}
          icon={PieChart}
          tooltipContent="Current total value of the investment portfolio"
        />
        <MetricCard
          title="Total Profit"
          value={formatCurrency(metrics.totalProfit)}
          subValue={`ROI: ${calculateROI()}%`}
          icon={Activity}
          tooltipContent="Total returns on investment"
        />
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Investment Track</h3>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
            <TrackSelector
              selectedTrack={selectedTrack}
              onTrackChange={handleTrackChange}
            />
          </div>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card className="col-span-4">
          <div className="p-6">
            <PerformanceChart 
              selectedTrack={selectedTrack} 
              onTrackChange={handleTrackChange}
              showTrackSelector={true}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ClientDetails;