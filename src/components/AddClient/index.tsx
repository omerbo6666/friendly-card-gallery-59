import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { PROFESSIONS, INVESTMENT_TRACKS } from '@/lib/constants';
import { generateMonthlyData } from '@/lib/utils';
import { Client, InvestmentTrack } from '@/types/investment';
import { getClients, saveClients } from '@/lib/localStorage';
import Preview from './Preview';

const AddClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    customProfession: '',
    monthlyExpenses: '',
    investmentPercentage: '',
    investmentTrack: '' as InvestmentTrack,
  });

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

    if (!formData.investmentTrack) {
      toast({
        title: "Error",
        description: "Please select an investment track",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const clients = getClients();
    const newClient: Client = {
      id: clients.length + 1,
      name: formData.name,
      profession: formData.profession === 'Other' ? formData.customProfession : formData.profession,
      customProfession: formData.profession === 'Other' ? formData.customProfession : undefined,
      monthlyExpenses: Number(formData.monthlyExpenses),
      investmentPercentage: formData.investmentPercentage,
      investmentTrack: formData.investmentTrack,
      monthlyData: generateMonthlyData({
        investmentPercentageOverride: Number(formData.investmentPercentage),
        startDate: new Date()
      }),
      startDate: new Date()
    };

    clients.push(newClient);
    saveClients(clients);

    toast({
      title: "Success",
      description: "Client added successfully",
    });

    navigate('/');
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
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Client Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter client name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="profession">Profession</Label>
              <Select
                value={formData.profession}
                onValueChange={(value) => handleSelectChange('profession', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select profession" />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONS.map((profession) => (
                    <SelectItem key={profession} value={profession}>
                      {profession}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.profession === 'Other' && (
              <div className="grid gap-2">
                <Label htmlFor="customProfession">Specify Profession</Label>
                <Input
                  id="customProfession"
                  name="customProfession"
                  placeholder="Enter profession"
                  value={formData.customProfession}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="monthlyExpenses">Monthly Expenses (ILS)</Label>
              <Input
                id="monthlyExpenses"
                name="monthlyExpenses"
                type="number"
                placeholder="Enter monthly expenses"
                value={formData.monthlyExpenses}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="investmentPercentage">Investment Percentage (%)</Label>
              <Input
                id="investmentPercentage"
                name="investmentPercentage"
                type="number"
                placeholder="Enter investment percentage"
                value={formData.investmentPercentage}
                onChange={handleInputChange}
                min="1"
                max="100"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="investmentTrack">Investment Track</Label>
              <Select
                value={formData.investmentTrack}
                onValueChange={(value) => handleSelectChange('investmentTrack', value as InvestmentTrack)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select investment track" />
                </SelectTrigger>
                <SelectContent>
                  {INVESTMENT_TRACKS.map((track) => (
                    <SelectItem key={track.id} value={track.id}>
                      {track.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

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
