import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ClientCard } from './ClientCard';

const Dashboard = () => {
  const navigate = useNavigate();

  const { data: clients, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_allocations (
            track_id,
            percentage
          ),
          monthly_performance (
            month,
            expenses,
            investment,
            portfolio_value,
            profit
          )
        `);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Client Dashboard</h1>
          <Button onClick={() => navigate('/add-client')}>
            Add New Client
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients?.map((client) => (
            <ClientCard 
              key={client.id} 
              client={client}
              metrics={{
                latestMonthlyInvestment: client.monthly_performance?.[0]?.investment || 0,
                currentValue: client.monthly_performance?.[0]?.portfolio_value || 0
              }}
              onSelect={() => navigate(`/client/${client.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;