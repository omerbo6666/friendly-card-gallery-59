import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { generateMonthlyData } from '@/lib/utils';
import InvestmentAllocation from '@/components/InvestmentAllocation';
import type { InvestmentAllocation as IInvestmentAllocation } from '@/types/investment';
import { supabase } from "@/integrations/supabase/client";
import Preview from './Preview';
import ClientBasicInfo from './ClientBasicInfo';
import FinancialInfo from './FinancialInfo';

const AddClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    customProfession: '',
    monthlyExpenses: '',
    investmentPercentage: '',
  });
  const [allocations, setAllocations] = useState<IInvestmentAllocation[]>([
    { trackId: 'SPY500', percentage: 100 }
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "Please enter client name",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.profession) {
      toast({
        title: "Error",
        description: "Please select a profession",
        variant: "destructive",
      });
      return false;
    }

    if (formData.profession === 'Other' && !formData.customProfession.trim()) {
      toast({
        title: "Error",
        description: "Please specify the profession",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.monthlyExpenses || isNaN(Number(formData.monthlyExpenses)) || Number(formData.monthlyExpenses) <= 0) {
      toast({
        title: "Error",
        description: "Please enter valid monthly expenses",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.investmentPercentage || isNaN(Number(formData.investmentPercentage)) || 
        Number(formData.investmentPercentage) <= 0 || Number(formData.investmentPercentage) > 100) {
      toast({
        title: "Error",
        description: "Please enter a valid investment percentage (1-100)",
        variant: "destructive",
      });
      return false;
    }

    const totalAllocation = allocations.reduce((sum, allocation) => sum + allocation.percentage, 0);
    if (totalAllocation !== 100) {
      toast({
        title: "Error",
        description: "Total investment allocation must equal 100%",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      // Insert new client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert({
          name: formData.name,
          profession: formData.profession === 'Other' ? formData.customProfession : formData.profession,
          monthly_expenses: Number(formData.monthlyExpenses),
          investment_percentage: Number(formData.investmentPercentage),
          start_date: new Date().toISOString()
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Insert allocations
      const { error: allocationsError } = await supabase
        .from('client_allocations')
        .insert(
          allocations.map(allocation => ({
            client_id: clientData.id,
            track_id: allocation.trackId,
            percentage: allocation.percentage
          }))
        );

      if (allocationsError) throw allocationsError;

      // Insert monthly performance data
      const monthlyData = generateMonthlyData({
        investmentPercentageOverride: Number(formData.investmentPercentage),
        startDate: new Date()
      });

      const { error: performanceError } = await supabase
        .from('monthly_performance')
        .insert(
          monthlyData.map(data => ({
            client_id: clientData.id,
            month: data.month,
            expenses: data.expenses,
            investment: data.investment,
            portfolio_value: data.portfolioValue,
            profit: data.profit
          }))
        );

      if (performanceError) throw performanceError;

      toast({
        title: "Success",
        description: "Client added successfully",
      });

      navigate('/');
    } catch (error) {
      console.error('Error adding client:', error);
      toast({
        title: "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Add New Client</h1>
            <Button variant="outline" onClick={() => navigate('/')}>
              Back to Dashboard
            </Button>
          </div>
          
          <Preview />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-border">
          <ClientBasicInfo
            name={formData.name}
            profession={formData.profession}
            customProfession={formData.customProfession}
            onInputChange={handleInputChange}
            onSelectChange={handleSelectChange}
          />

          <FinancialInfo
            monthlyExpenses={formData.monthlyExpenses}
            investmentPercentage={formData.investmentPercentage}
            onInputChange={handleInputChange}
          />

          <InvestmentAllocation
            allocations={allocations}
            onAllocationsChange={setAllocations}
          />

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit">Add Client</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClient;