import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatCurrency } from '@/utils/chartDataUtils';

interface ChartData {
  id: string;
  color: string;
  data: Array<{
    x: string;
    y: number;
  }>;
}

interface LineChartProps {
  data: ChartData[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const isMobile = useIsMobile();

  return (
    <div className="h-[500px] bg-background/50 rounded-lg p-4 border border-border/50">
      {data.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <p className="text-muted-foreground">No data available for the selected time range</p>
        </div>
      ) : (
        <ResponsiveLine
          data={data}
          margin={{ 
            top: 50, 
            right: isMobile ? 20 : 110, 
            bottom: 70, 
            left: isMobile ? 60 : 80 
          }}
          xScale={{
            type: 'time',
            format: '%Y-%m-%d',
            useUTC: false,
            precision: 'day',
          }}
          xFormat="time:%Y-%m-%d"
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
          }}
          curve="monotoneX"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            format: '%b %d, %Y',
            legend: 'Timeline',
            legendOffset: 50,
            legendPosition: 'middle'
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            format: value => formatCurrency(value),
            legend: 'Amount (₪)',
            legendOffset: -60,
            legendPosition: 'middle'
          }}
          enablePoints={false}
          enableArea={true}
          areaOpacity={0.1}
          enableGridX={true}
          enableGridY={true}
          lineWidth={2}
          pointSize={8}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 140,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
              effects: [
                {
                  on: 'hover',
                  style: {
                    itemBackground: 'rgba(0, 0, 0, .03)',
                    itemOpacity: 1
                  }
                }
              ]
            }
          ]}
          theme={{
            axis: {
              ticks: {
                text: {
                  fontSize: isMobile ? 10 : 11,
                  fill: 'hsl(var(--muted-foreground))'
                }
              },
              legend: {
                text: {
                  fontSize: isMobile ? 11 : 12,
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
                stroke: 'hsl(var(--primary))',
                strokeWidth: 1,
                strokeOpacity: 0.5
              }
            }
          }}
          tooltip={({ point }) => {
            const data = point.data as any;
            return (
              <div className="bg-popover text-popover-foreground rounded-lg shadow-lg p-3 space-y-2">
                <div className="font-semibold border-b border-border pb-2">{data.xFormatted}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: point.serieColor }}
                    />
                    <span>{point.serieId}:</span>
                    <span className="font-semibold">{formatCurrency(data.y)}</span>
                  </div>
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
};

export default LineChart;