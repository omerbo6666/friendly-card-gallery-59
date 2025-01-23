import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/components/ui/use-toast";
import { PROFESSIONS, INVESTMENT_TRACKS } from '@/lib/constants';
import { Client, InvestmentTrack } from '@/types/investment';
import { generateMonthlyData } from '@/lib/utils';
import { addClient } from '@/lib/localStorage';

const AddClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    customProfession: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    investmentPercentage: 10,
    investmentTrack: INVESTMENT_TRACKS[0].name as InvestmentTrack
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.profession || !formData.monthlyIncome || !formData.monthlyExpenses) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (formData.profession === 'Other' && !formData.customProfession) {
      toast({
        title: "Error",
        description: "Please specify your profession",
        variant: "destructive"
      });
      return;
    }

    const newClient: Client = {
      id: Date.now(),
      name: formData.name,
      profession: formData.profession === 'Other' ? formData.customProfession : formData.profession,
      customProfession: formData.profession === 'Other' ? formData.customProfession : undefined,
      monthlyExpenses: Number(formData.monthlyExpenses),
      investmentPercentage: formData.investmentPercentage.toString(),
      investmentTrack: formData.investmentTrack,
      monthlyData: generateMonthlyData(formData.investmentPercentage)
    };

    addClient(newClient);
    
    toast({
      title: "Success",
      description: "Client added successfully"
    });

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Add New Client</h1>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-xl border border-border">
          <div className="space-y-2">
            <Label htmlFor="name">Client Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter client name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="profession">Profession</Label>
            <Select
              value={formData.profession}
              onValueChange={(value) => setFormData(prev => ({ ...prev, profession: value }))}
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
            <div className="space-y-2">
              <Label htmlFor="customProfession">Specify Profession</Label>
              <Input
                id="customProfession"
                value={formData.customProfession}
                onChange={(e) => setFormData(prev => ({ ...prev, customProfession: e.target.value }))}
                placeholder="Enter your profession"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="monthlyIncome">Monthly Income (ILS)</Label>
            <Input
              id="monthlyIncome"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyIncome: e.target.value }))}
              placeholder="Enter monthly income"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthlyExpenses">Monthly Expenses (ILS)</Label>
            <Input
              id="monthlyExpenses"
              type="number"
              value={formData.monthlyExpenses}
              onChange={(e) => setFormData(prev => ({ ...prev, monthlyExpenses: e.target.value }))}
              placeholder="Enter monthly expenses"
            />
          </div>

          <div className="space-y-2">
            <Label>Investment Percentage ({formData.investmentPercentage}%)</Label>
            <Slider
              value={[formData.investmentPercentage]}
              onValueChange={(value) => setFormData(prev => ({ ...prev, investmentPercentage: value[0] }))}
              min={3}
              max={20}
              step={0.5}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="investmentTrack">Investment Track</Label>
            <Select
              value={formData.investmentTrack}
              onValueChange={(value: InvestmentTrack) => setFormData(prev => ({ ...prev, investmentTrack: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select investment track" />
              </SelectTrigger>
              <SelectContent>
                {INVESTMENT_TRACKS.map((track) => (
                  <SelectItem key={track.name} value={track.name}>
                    {track.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Add Client
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddClient;