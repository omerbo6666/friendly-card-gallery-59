import React, { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Client, MonthlyData } from '@/types/investment';
import { ClientCard } from './ClientCard';
import { MetricCard } from './MetricCard';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { INVESTMENT_TRACKS, PROFESSIONS } from '@/lib/constants';
import PerformanceChart from '@/components/PerformanceChart';
import { format } from 'date-fns';

const Dashboard = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const navigate = useNavigate();

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      console.log('Fetching clients...');
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          client_allocations (*),
          monthly_performance (*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching clients:', error);
        throw error;
      }

      // Transform the data to match our Client interface
      return data.map((client): Client => {
        const monthlyData: MonthlyData[] = client.monthly_performance.map((perf: any) => ({
          month: perf.month,
          expenses: perf.expenses,
          investment: perf.investment,
          portfolioValue: perf.portfolio_value,
          profit: perf.profit
        }));

        return {
          id: client.id,
          name: client.name,
          profession: client.profession,
          investmentTrack: client.investment_track,
          monthlyData,
          monthlyExpenses: client.monthly_expenses,
          investmentPercentage: client.investment_percentage.toString(),
          startDate: new Date(client.start_date)
        };
      });
    }
  });

  const calculateMetrics = (client: Client) => {
    const lastMonth = client.monthlyData[client.monthlyData.length - 1];
    return {
      currentValue: lastMonth.portfolioValue,
      latestMonthlyInvestment: lastMonth.investment
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-2 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-8">
        <div className="w-full md:w-auto">
          <Button 
            size="lg"
            className="w-full h-auto bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 hover:from-violet-600 hover:via-purple-600 hover:to-indigo-600 text-white font-semibold px-6 md:px-8 py-4 md:py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/10"
            onClick={() => navigate('/add-client')}
          >
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm md:text-lg font-bold tracking-tight">
                Add New Client
              </span>
              <span className="text-xs md:text-sm font-normal text-white/90">
                Start managing a new portfolio
              </span>
            </div>
          </Button>
        </div>
        <ThemeToggle />
      </div>

      <div className="space-y-6 md:space-y-8">
        <div className="mb-6 md:mb-8">
          <PerformanceChart showTrackSelector={false} />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {clients.map(client => (
            <ClientCard
              key={client.id}
              client={client}
              metrics={calculateMetrics(client)}
              onSelect={setSelectedClient}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;