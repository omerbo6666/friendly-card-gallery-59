import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Client } from '@/types/investment';
import { ResponsiveLine } from '@nivo/line';

interface ClientCardProps {
  client: Client;
  metrics: {
    latestMonthlyInvestment: number;
    currentValue: number;
  };
  onSelect: (client: Client) => void;
}

const chartTheme = {
  background: "transparent",
  axis: {
    domain: {
      line: {
        stroke: "hsl(var(--border))",
        strokeWidth: 1
      }
    },
    ticks: {
      text: {
        fill: "hsl(var(--muted-foreground))",
        fontSize: 10
      }
    }
  },
  grid: {
    line: {
      stroke: "hsl(var(--border))",
      strokeWidth: 1,
      strokeDasharray: "4 4"
    }
  },
  crosshair: {
    line: {
      stroke: "hsl(var(--muted-foreground))",
      strokeWidth: 1,
      strokeOpacity: 0.35
    }
  },
  tooltip: {
    container: {
      background: "hsl(var(--background))",
      color: "hsl(var(--foreground))",
      fontSize: 12,
      borderRadius: "6px",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      padding: "8px 12px",
      border: "1px solid hsl(var(--border))"
    }
  }
};

export const ClientCard = ({ client, metrics, onSelect }: ClientCardProps) => {
  const chartData = [
    {
      id: "Portfolio Value",
      color: "#8B5CF6",
      data: client.monthlyData.map(d => ({
        x: `M${d.month}`,
        y: Number(d.portfolioValue.toFixed(2))
      }))
    },
    {
      id: "Investment",
      color: "#0EA5E9",
      data: client.monthlyData.map(d => ({
        x: `M${d.month}`,
        y: Number(d.investment.toFixed(2))
      }))
    },
    {
      id: "Profit",
      color: "#F97316",
      data: client.monthlyData.map(d => ({
        x: `M${d.month}`,
        y: Number(d.profit.toFixed(2))
      }))
    }
  ];

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(client)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <p className="text-sm text-muted-foreground">{client.profession}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            client.investmentTrack === 'Long Term Bonds' ? 'bg-blue-100 text-blue-800' :
            client.investmentTrack === 'Mixed Portfolio' ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            {client.investmentTrack}
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] mb-4">
          <ResponsiveLine
            data={chartData}
            margin={{ top: 10, right: 10, bottom: 20, left: 40 }}
            xScale={{
              type: 'point'
            }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false
            }}
            curve="monotoneX"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: -45,
              tickValues: client.monthlyData.filter((_, i) => i % 12 === 0).map(d => `M${d.month}`)
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              format: value => `${(value / 1000).toFixed(0)}k`
            }}
            enableGridX={false}
            enablePoints={false}
            enableArea={true}
            areaOpacity={0.15}
            useMesh={true}
            theme={chartTheme}
            colors={['#8B5CF6', '#0EA5E9', '#F97316']}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Monthly Investment</p>
            <p className="font-medium">
              {metrics.latestMonthlyInvestment.toLocaleString('en-IL', { 
                style: 'currency', 
                currency: 'ILS' 
              })}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Portfolio Value</p>
            <p className="font-medium">
              {metrics.currentValue.toLocaleString('en-IL', { 
                style: 'currency', 
                currency: 'ILS' 
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};