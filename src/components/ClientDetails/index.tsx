import React, { useState, useEffect } from 'react';
import { Client, ClientMetrics, InvestmentTrack } from '@/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  Activity,
  Percent,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { INVESTMENT_TRACKS } from '@/lib/constants';
import { ResponsiveLine } from '@nivo/line';
import { format, isValid, parseISO } from 'date-fns';
import PerformanceChart from '@/components/PerformanceChart';

interface ClientDetailsProps {
  client: Client;
  metrics: ClientMetrics;
}

const ClientDetails = ({ client, metrics }: ClientDetailsProps) => {
  const [selectedTrack, setSelectedTrack] = useState<InvestmentTrack>(client.investmentTrack);

  useEffect(() => {
    // Update selected track when client changes
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

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalInvestment)}</div>
            <p className="text-xs text-muted-foreground">
              Monthly: {formatCurrency(metrics.latestMonthlyInvestment)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.portfolioValue)}</div>
            <p className="text-xs text-muted-foreground">
              Management Fee: {formatCurrency(metrics.managementFee)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalProfit)}</div>
            <p className="text-xs text-muted-foreground">
              ROI: {calculateROI()}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investment Track</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Select value={selectedTrack} onValueChange={(value) => handleTrackChange(value as InvestmentTrack)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select track" />
              </SelectTrigger>
              <SelectContent>
                {INVESTMENT_TRACKS.map((track) => (
                  <SelectItem key={track.id} value={track.id}>
                    {track.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <PerformanceChart selectedTrack={selectedTrack} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientDetails;