import React, { useState } from 'react';
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
import { format } from 'date-fns';

interface ClientDetailsProps {
  client: Client;
  metrics: ClientMetrics;
}

const ClientDetails = ({ client, metrics }: ClientDetailsProps) => {
  const [comparisonTrack, setComparisonTrack] = useState<InvestmentTrack | null>(null);

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

  const formatChartData = () => {
    return [
      {
        id: "Portfolio Value",
        color: "hsl(var(--primary))",
        data: client.monthlyData.map((d, index) => ({
          x: `Month ${d.month}`,
          y: d.portfolioValue,
          tooltip: {
            investment: d.investment,
            profit: d.profit,
            expenses: d.expenses
          }
        }))
      }
    ];
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Investment Start</span>
              </div>
              <p className="text-lg font-medium">
                {format(new Date(client.startDate), 'MMM dd, yyyy')}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <PieChart className="w-4 h-4" />
                <span>Investment Track</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-lg font-medium">{trackDetails?.name}</p>
                <Select
                  value={comparisonTrack || undefined}
                  onValueChange={(value: InvestmentTrack) => setComparisonTrack(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Compare with..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INVESTMENT_TRACKS.filter(track => track.id !== client.investmentTrack).map(track => (
                      <SelectItem key={track.id} value={track.id}>
                        {track.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Percent className="w-4 h-4" />
                <span>Investment %</span>
              </div>
              <p className="text-lg font-medium">
                {formatPercentage(Number(client.investmentPercentage))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveLine
              data={formatChartData()}
              margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
              xScale={{ type: 'point' }}
              yScale={{
                type: 'linear',
                min: 'auto',
                max: 'auto',
                stacked: false,
                reverse: false
              }}
              yFormat=" >-.2f"
              axisTop={null}
              axisRight={null}
              axisBottom={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: -45,
                legend: 'Timeline',
                legendOffset: 36,
                legendPosition: 'middle',
                format: (value) => String(value)  // Explicitly convert to string
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Portfolio Value (ILS)',
                legendOffset: -40,
                legendPosition: 'middle',
                format: (value) => formatCurrency(Number(value))  // Ensure value is converted to number
              }}
              enablePoints={true}
              pointSize={8}
              pointColor={{ theme: 'background' }}
              pointBorderWidth={2}
              pointBorderColor={{ from: 'serieColor' }}
              pointLabelYOffset={-12}
              enableArea={true}
              areaOpacity={0.15}
              useMesh={true}
              enableSlices="x"
              crosshairType="cross"
              theme={{
                axis: {
                  ticks: {
                    text: {
                      fontSize: 11,
                      fill: 'hsl(var(--muted-foreground))'
                    }
                  },
                  legend: {
                    text: {
                      fontSize: 12,
                      fill: 'hsl(var(--muted-foreground))',
                      fontWeight: 500
                    }
                  }
                },
                grid: {
                  line: {
                    stroke: 'hsl(var(--border))',
                    strokeWidth: 1,
                    strokeDasharray: '4 4'
                  }
                },
                crosshair: {
                  line: {
                    stroke: 'hsl(var(--muted-foreground))',
                    strokeWidth: 1,
                    strokeOpacity: 0.35
                  }
                },
                tooltip: {
                  container: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    fontSize: 12,
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    padding: '6px 10px',
                    border: '1px solid hsl(var(--border))'
                  }
                }
              }}
              tooltip={({ point }) => {
                const data = point.data as any;
                return (
                  <div className="bg-popover text-popover-foreground rounded-lg shadow-lg p-2 text-sm">
                    <div className="font-semibold">{point.data.x}</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-4">
                        <span>Portfolio Value:</span>
                        <span className="font-medium">{formatCurrency(point.data.y as number)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Investment:</span>
                        <span className="font-medium">{formatCurrency(data.tooltip.investment)}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span>Profit:</span>
                        <span className={`font-medium ${data.tooltip.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {formatCurrency(data.tooltip.profit)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </CardContent>
      </Card>

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
