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
import { Calendar } from "@/components/ui/calendar";
import { format, parse, isValid } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from 'lucide-react';
import { cn } from "@/lib/utils";

interface InvestmentAllocation {
  trackId: InvestmentTrack;
  percentage: number;
}

const AddClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [dateInputValue, setDateInputValue] = useState(format(new Date(), 'yyyy-MM-dd'));
  
  const [formData, setFormData] = useState({
    name: '',
    profession: '',
    customProfession: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    investmentPercentage: 10,
  });

  const [allocations, setAllocations] = useState<InvestmentAllocation[]>([
    { trackId: 'SPY500', percentage: 100 }
  ]);

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setStartDate(date);
      setDateInputValue(format(date, 'yyyy-MM-dd'));
    }
  };

  const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDateInputValue(value);
    
    const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
    if (isValid(parsedDate)) {
      setStartDate(parsedDate);
    }
  };

  const addTrack = () => {
    if (allocations.length < 3) {
      const availableTracks = INVESTMENT_TRACKS.filter(
        track => !allocations.find(a => a.trackId === track.id)
      );
      if (availableTracks.length > 0) {
        setAllocations([...allocations, { trackId: availableTracks[0].id, percentage: 0 }]);
      }
    }
  };

  const removeTrack = (index: number) => {
    setAllocations(allocations.filter((_, i) => i !== index));
  };

  const updateAllocation = (index: number, value: number) => {
    const newAllocations = [...allocations];
    newAllocations[index].percentage = value;
    
    // Adjust other allocations to maintain 100% total
    const total = newAllocations.reduce((sum, alloc, i) => i === index ? sum : sum + alloc.percentage, 0);
    const remaining = 100 - value;
    
    if (remaining > 0) {
      const othersCount = newAllocations.length - 1;
      newAllocations.forEach((alloc, i) => {
        if (i !== index) {
          alloc.percentage = remaining / othersCount;
        }
      });
    }
    
    setAllocations(newAllocations);
  };

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

    // Generate monthly data for each allocation
    const combinedMonthlyData = generateMonthlyData({
      investmentPercentageOverride: formData.investmentPercentage,
      allocations,
      startDate
    });

    const newClient: Client = {
      id: Date.now(),
      name: formData.name,
      profession: formData.profession === 'Other' ? 'Other' : formData.profession,
      customProfession: formData.profession === 'Other' ? formData.customProfession : undefined,
      monthlyExpenses: Number(formData.monthlyExpenses),
      investmentPercentage: formData.investmentPercentage.toString(),
      investmentTrack: allocations[0].trackId,
      monthlyData: combinedMonthlyData,
      startDate,
      allocations
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
          {/* Basic Info */}
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
            
            {formData.profession === 'Other' && (
              <div className="mt-2">
                <Label htmlFor="customProfession">Specify Profession</Label>
                <Input
                  id="customProfession"
                  value={formData.customProfession}
                  onChange={(e) => setFormData(prev => ({ ...prev, customProfession: e.target.value }))}
                  placeholder="Enter your profession"
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <div className="flex gap-2">
              <Input
                type="date"
                value={dateInputValue}
                onChange={handleDateInputChange}
                className="flex-1"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[280px] justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

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

          {/* Investment Allocations */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Investment Allocations</Label>
              {allocations.length < 3 && (
                <Button type="button" variant="outline" onClick={addTrack}>
                  Add Track
                </Button>
              )}
            </div>
            
            {allocations.map((allocation, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Select
                    value={allocation.trackId}
                    onValueChange={(value: InvestmentTrack) => {
                      const newAllocations = [...allocations];
                      newAllocations[index].trackId = value;
                      setAllocations(newAllocations);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INVESTMENT_TRACKS
                        .filter(track => !allocations.find((a, i) => i !== index && a.trackId === track.id))
                        .map((track) => (
                          <SelectItem key={track.id} value={track.id}>
                            {track.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  {allocations.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTrack(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Allocation ({allocation.percentage.toFixed(1)}%)</Label>
                  <Slider
                    value={[allocation.percentage]}
                    onValueChange={(value) => updateAllocation(index, value[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                </div>
              </div>
            ))}
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
