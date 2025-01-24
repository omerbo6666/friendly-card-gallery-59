import React from 'react';
import { Client, ClientMetrics } from '@/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  Activity,
  Percent,
  AlertCircle,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { INVESTMENT_TRACKS } from '@/lib/constants';

interface ClientDetailsProps {
  client: Client;
  metrics: ClientMetrics;
}

const ClientDetails = ({ client, metrics }: ClientDetailsProps) => {
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

  const getTrackDetails = () => {
    return INVESTMENT_TRACKS.find(track => track.id === client.investmentTrack);
  };

  const getLatestPerformance = () => {
    const lastMonth = client.monthlyData[client.monthlyData.length - 1];
    const previousMonth = client.monthlyData[client.monthlyData.length - 2];
    if (!lastMonth || !previousMonth) return 0;
    
    return ((lastMonth.portfolioValue - previousMonth.portfolioValue) / previousMonth.portfolioValue) * 100;
  };

  const trackDetails = getTrackDetails();
  const latestPerformance = getLatestPerformance();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl font-bold">{client.name}</CardTitle>
              <p className="text-muted-foreground mt-1">
                {client.profession}
                {client.customProfession && ` - ${client.customProfession}`}
              </p>
            </div>
            <Badge 
              variant={latestPerformance >= 0 ? "success" : "destructive"}
              className="flex items-center gap-1"
            >
              {latestPerformance >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {formatPercentage(latestPerformance)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Investment Start Date</span>
              </div>
              <p className="text-lg font-medium">
                {new Date(client.startDate).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PieChart className="w-4 h-4" />
                <span>Investment Track</span>
              </div>
              <p className="text-lg font-medium">{trackDetails?.name}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Percent className="w-4 h-4" />
                <span>Investment Percentage</span>
              </div>
              <p className="text-lg font-medium">
                {formatPercentage(Number(client.investmentPercentage))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.portfolioValue)}
              </div>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total invested: {formatCurrency(metrics.totalInvestment)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Profit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.totalProfit)}
              </div>
              <Activity className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ROI: {calculateROI()}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Monthly Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">
                {formatCurrency(metrics.latestMonthlyInvestment)}
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Latest monthly investment amount</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Management fee: {formatCurrency(metrics.managementFee)}
            </p>
          </CardContent>
        </Card>
      </div>

      {client.allocations && client.allocations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-medium">Investment Allocations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {client.allocations.map((allocation, index) => {
                const track = INVESTMENT_TRACKS.find(t => t.id === allocation.trackId);
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span>{track?.name}</span>
                    </div>
                    <span className="font-medium">{formatPercentage(allocation.percentage)}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Monthly Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {client.monthlyData.slice(-6).reverse().map((month, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Month {month.month}
                </span>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(month.portfolioValue)}</p>
                    <p className="text-sm text-muted-foreground">
                      Investment: {formatCurrency(month.investment)}
                    </p>
                  </div>
                  <Badge 
                    variant={month.profit >= 0 ? "success" : "destructive"}
                    className="w-24 justify-center"
                  >
                    {formatCurrency(month.profit)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDetails;