import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useIsMobile } from '@/hooks/use-mobile';

interface MaximizedChartProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  title: string;
}

export const MaximizedChart: React.FC<MaximizedChartProps> = ({
  isOpen,
  onClose,
  data,
  title
}) => {
  const isMobile = useIsMobile();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[1200px] h-[80vh]">
        <div className="h-full p-4">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          <div className="h-[calc(100%-2rem)]">
            <ResponsiveLine
              data={data}
              margin={{ top: 50, right: 110, bottom: 50, left: 80 }}
              xScale={{ type: 'point' }}
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
                legend: 'Timeline',
                legendOffset: 40,
                legendPosition: 'middle'
              }}
              axisLeft={{
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Amount (ILS)',
                legendOffset: -60,
                legendPosition: 'middle',
                format: (value) => 
                  new Intl.NumberFormat('he-IL', {
                    style: 'currency',
                    currency: 'ILS',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  }).format(value)
              }}
              enableGridX={false}
              enableGridY={true}
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
              motionConfig="gentle"
              legends={[
                {
                  anchor: 'right',
                  direction: 'column',
                  justify: false,
                  translateX: 100,
                  translateY: 0,
                  itemsSpacing: 0,
                  itemDirection: 'left-to-right',
                  itemWidth: 100,
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
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};