import React from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import { formatCurrency } from '@/utils/chartDataUtils';
import { GlobalMetrics } from '@/types/investment';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartContainerProps {
  data: GlobalMetrics[];
}

const ChartContainer: React.FC<ChartContainerProps> = ({ data }) => {
  const options: ApexOptions = {
    chart: {
      type: 'line',
      zoom: {
        enabled: true,
        type: 'x',
      },
      toolbar: {
        show: true,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    colors: ['#3b82f6', '#22c55e', '#f97316', '#fbbf24'],
    xaxis: {
      type: 'category',
      categories: data.map(d => d.date),
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
        },
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => formatCurrency(value),
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => formatCurrency(value),
      },
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
  };

  const series = [
    {
      name: 'Total Managed Funds',
      data: data.map(d => d.total_managed_funds),
    },
    {
      name: 'Cumulative Investment',
      data: data.map(d => d.cumulative_investment),
    },
    {
      name: 'Cumulative Profit',
      data: data.map(d => d.cumulative_profit),
    },
    {
      name: 'Management Fees',
      data: data.map(d => d.management_fees),
    },
  ];

  return (
    <div className="w-full h-[500px]">
      <Chart
        options={options}
        series={series}
        type="line"
        height="100%"
      />
    </div>
  );
};

export default ChartContainer;