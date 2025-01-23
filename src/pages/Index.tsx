import React, { useState, useEffect } from 'react';
import { MetricsCards } from '@/components/dashboard/MetricsCards';
import { PerformanceChart } from '@/components/dashboard/PerformanceChart';
import { Client, FundMetrics } from '@/types/dashboard';
import { generateClients, calculateFundMetrics } from '@/utils/dashboard';

export default function Dashboard() {
  const [clients, setClients] = useState<Client[]>([]);
  const [fundMetrics, setFundMetrics] = useState<FundMetrics>({
    totalPortfolio: 0,
    totalProfit: 0,
    totalFees: 0,
    avgROI: 0,
    professionStats: {},
    monthlyPerformance: []
  });
  const [view, setView] = useState<'fund' | 'individual'>('fund');

  useEffect(() => {
    const generatedClients = generateClients();
    setClients(generatedClients);
    const metrics = calculateFundMetrics(generatedClients);
    setFundMetrics(metrics);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-violet-400">
              Investment Fund Dashboard
            </h1>
            <p className="text-gray-400">Managing {clients.length} clients</p>
          </div>
          <select 
            className="bg-gray-800 border border-gray-700 rounded-md px-4 py-2 text-gray-200"
            value={view}
            onChange={(e) => setView(e.target.value as 'fund' | 'individual')}
          >
            <option value="fund">Fund Overview</option>
            <option value="individual">Individual Clients</option>
          </select>
        </header>

        <MetricsCards metrics={fundMetrics} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PerformanceChart data={fundMetrics.monthlyPerformance} />
          {/* Additional charts and components will be added here */}
        </div>
      </div>
    </div>
  );
}
