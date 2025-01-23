import React from 'react';
import { Client } from '@/types/investment';

interface ClientMetrics {
  monthlyInvestment: number;
  portfolioValue: number;
  totalProfit: number;
}

interface ClientCardProps {
  client: Client;
  metrics: ClientMetrics;
  onClick: () => void;
}

export const ClientCard = ({ client, metrics, onClick }: ClientCardProps) => (
  <div
    className="bg-white p-6 rounded-lg shadow hover:shadow-md cursor-pointer"
    onClick={onClick}
  >
    <div className="grid grid-cols-4 gap-4">
      <div>
        <div className="font-semibold">{client.name}</div>
        <div className="text-sm text-gray-500">{client.profession}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Monthly Investment</div>
        <div className="font-medium">₪{metrics.monthlyInvestment.toLocaleString()}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Portfolio Value</div>
        <div className="font-medium">₪{metrics.portfolioValue.toLocaleString()}</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">Total Profit</div>
        <div className="font-medium">₪{metrics.totalProfit.toLocaleString()}</div>
      </div>
    </div>
    <div className="mt-2">
      <span className={`px-3 py-1 rounded-full text-sm ${
        client.riskProfile === 'Conservative' ? 'bg-blue-100 text-blue-800' :
        client.riskProfile === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
        'bg-red-100 text-red-800'
      }`}>
        {client.riskProfile}
      </span>
    </div>
  </div>
);