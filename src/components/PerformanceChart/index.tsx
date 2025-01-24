import React from "react";
import { Card } from "@/components/ui/card";
import {
  SP500_RETURNS,
  NASDAQ_RETURNS,
  RUSSELL_2000_RETURNS,
  VTI_RETURNS,
  SCHWAB_RETURNS,
  IWV_RETURNS,
  WFIVX_RETURNS
} from "@/lib/investmentReturns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { format, parseISO } from "date-fns";

const PerformanceChart = () => {
  const formatData = () => {
    const combinedData = SP500_RETURNS.map((item) => ({
      date: item.date,
      SP500: item.change,
      NASDAQ: NASDAQ_RETURNS.find(n => n.date === item.date)?.change || 0,
      RUSSELL2000: RUSSELL_2000_RETURNS.find(r => r.date === item.date)?.change || 0,
      VTI: VTI_RETURNS.find(v => v.date === item.date)?.change || 0,
      SCHWAB: SCHWAB_RETURNS.find(s => s.date === item.date)?.change || 0,
      IWV: IWV_RETURNS.find(i => i.date === item.date)?.change || 0,
      WFIVX: WFIVX_RETURNS.find(w => w.date === item.date)?.change || 0
    }));

    return combinedData.sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
  };

  const data = formatData();

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Investment Performance</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), 'MMM yyyy')}
            />
            <YAxis
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip
              formatter={(value: number) => [`${value.toFixed(2)}%`]}
              labelFormatter={(label) => format(parseISO(label as string), 'MMMM yyyy')}
            />
            <Legend />
            <Line type="monotone" dataKey="SP500" stroke="#8884d8" name="S&P 500" />
            <Line type="monotone" dataKey="NASDAQ" stroke="#82ca9d" name="NASDAQ" />
            <Line type="monotone" dataKey="RUSSELL2000" stroke="#ffc658" name="Russell 2000" />
            <Line type="monotone" dataKey="VTI" stroke="#ff7300" name="VTI" />
            <Line type="monotone" dataKey="SCHWAB" stroke="#00C49F" name="Schwab" />
            <Line type="monotone" dataKey="IWV" stroke="#FFBB28" name="IWV" />
            <Line type="monotone" dataKey="WFIVX" stroke="#FF8042" name="WFIVX" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;