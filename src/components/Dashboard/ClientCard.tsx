import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Client, ClientMetrics } from '@/types/investment';

interface ClientCardProps {
  client: Client;
  metrics: ClientMetrics;
  onSelect: (client: Client) => void;
}

export const ClientCard = ({ client, metrics, onSelect }: ClientCardProps) => (
  <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(client)}>
    <CardHeader className="pb-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{client.name}</h3>
          <p className="text-sm text-muted-foreground">{client.profession}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm ${
          client.riskProfile === 'Conservative' ? 'bg-blue-100 text-blue-800' :
          client.riskProfile === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {client.riskProfile}
        </span>
      </div>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Monthly Investment</p>
          <p className="font-medium">
            {(client.monthlyExpenses * (parseFloat(client.investmentPercentage) / 100)).toLocaleString('en-IL', { 
              style: 'currency', 
              currency: 'ILS' 
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Portfolio Value</p>
          <p className="font-medium">
            {metrics.portfolioValue.toLocaleString('en-IL', { 
              style: 'currency', 
              currency: 'ILS' 
            })}
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);