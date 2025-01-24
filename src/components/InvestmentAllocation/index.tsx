import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { INVESTMENT_TRACKS } from '@/lib/constants';
import type { InvestmentAllocation as IInvestmentAllocation, InvestmentTrack } from '@/types/investment';
import { PlusCircle, MinusCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AllocationProps {
  allocations: IInvestmentAllocation[];
  onAllocationsChange: (allocations: IInvestmentAllocation[]) => void;
  disabled?: boolean;
}

export const InvestmentAllocation = ({ allocations, onAllocationsChange, disabled = false }: AllocationProps) => {
  const { toast } = useToast();
  const [localAllocations, setLocalAllocations] = useState<IInvestmentAllocation[]>(allocations);
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    const total = localAllocations.reduce((sum, allocation) => sum + Number(allocation.percentage), 0);
    setTotalPercentage(total);
  }, [localAllocations]);

  const handleAddTrack = () => {
    if (localAllocations.length >= 3) {
      toast({
        title: "Maximum tracks reached",
        description: "You can only allocate investments across up to 3 tracks",
        variant: "destructive",
      });
      return;
    }

    const availableTracks = INVESTMENT_TRACKS
      .map(track => track.id)
      .filter(trackId => !localAllocations.some(allocation => allocation.trackId === trackId)) as InvestmentTrack[];

    if (availableTracks.length === 0) {
      toast({
        title: "No more tracks available",
        description: "All available tracks have been allocated",
        variant: "destructive",
      });
      return;
    }

    setLocalAllocations([
      ...localAllocations,
      { trackId: availableTracks[0], percentage: 0 }
    ]);
  };

  const handleRemoveTrack = (index: number) => {
    const newAllocations = localAllocations.filter((_, i) => i !== index);
    setLocalAllocations(newAllocations);
    onAllocationsChange(newAllocations);
  };

  const handleTrackChange = (index: number, trackId: InvestmentTrack) => {
    const newAllocations = [...localAllocations];
    newAllocations[index].trackId = trackId;
    setLocalAllocations(newAllocations);
    onAllocationsChange(newAllocations);
  };

  const handlePercentageChange = (index: number, value: string) => {
    const percentage = Number(value);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) return;

    const newAllocations = [...localAllocations];
    newAllocations[index].percentage = percentage;
    setLocalAllocations(newAllocations);
    onAllocationsChange(newAllocations);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Investment Allocation</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddTrack}
          disabled={disabled || localAllocations.length >= 3}
        >
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Track
        </Button>
      </div>

      <div className="space-y-4">
        {localAllocations.map((allocation, index) => (
          <div key={index} className="flex items-end gap-4">
            <div className="flex-1">
              <Label>Investment Track</Label>
              <Select
                value={allocation.trackId}
                onValueChange={(value) => handleTrackChange(index, value as InvestmentTrack)}
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select track" />
                </SelectTrigger>
                <SelectContent>
                  {INVESTMENT_TRACKS
                    .filter(track => 
                      track.id === allocation.trackId || 
                      !localAllocations.some(a => a.trackId === track.id)
                    )
                    .map((track) => (
                      <SelectItem key={track.id} value={track.id}>
                        {track.name}
                      </SelectItem>
                    ))
                  }
                </SelectContent>
              </Select>
            </div>

            <div className="w-32">
              <Label>Percentage</Label>
              <div className="relative">
                <Input
                  type="number"
                  value={allocation.percentage}
                  onChange={(e) => handlePercentageChange(index, e.target.value)}
                  min="0"
                  max="100"
                  disabled={disabled}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveTrack(index)}
              disabled={disabled || localAllocations.length === 1}
              className="mb-0.5"
            >
              <MinusCircle className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>

      <div className={cn(
        "flex items-center gap-2 text-sm",
        totalPercentage !== 100 ? "text-destructive" : "text-muted-foreground"
      )}>
        <AlertCircle className="w-4 h-4" />
        Total allocation: {totalPercentage}%
        {totalPercentage !== 100 && " (must equal 100%)"}
      </div>
    </div>
  );
};

// Add named export as well as default export
export default InvestmentAllocation;
