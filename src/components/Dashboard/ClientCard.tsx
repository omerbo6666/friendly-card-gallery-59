import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Client, Metrics } from '@/types/investment';
import { INVESTMENT_TRACKS } from '@/lib/constants';

interface ClientCardProps {
  client: Client;
  metrics: Metrics;
  onSelect: (client: Client) => void;
}

export const ClientCard = ({ client, metrics, onSelect }: ClientCardProps) => {
  const selectedTrack = INVESTMENT_TRACKS.find(track => track.id === client.investmentTrack);
  
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelect(client)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{client.name}</h3>
            <p className="text-sm text-muted-foreground">{client.profession}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm ${
            selectedTrack?.id === 'SPY500' ? 'bg-blue-100 text-blue-800' :
            selectedTrack?.id === 'NASDAQ100' ? 'bg-green-100 text-green-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {selectedTrack?.name}
          </span>
        </div>
      </CardHeader>
      <CardContent>
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