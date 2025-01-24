import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvestmentTrack } from '@/types/investment';
import { INVESTMENT_TRACKS } from '@/lib/constants';

interface TrackSelectorProps {
  selectedTrack: InvestmentTrack;
  onTrackChange: (track: InvestmentTrack) => void;
  disabled?: boolean;
}

const TrackSelector = ({ selectedTrack, onTrackChange, disabled }: TrackSelectorProps) => {
  return (
    <Select 
      value={selectedTrack} 
      onValueChange={(value) => onTrackChange(value as InvestmentTrack)}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select track" />
      </SelectTrigger>
      <SelectContent>
        {INVESTMENT_TRACKS.map((track) => (
          <SelectItem key={track.id} value={track.id}>
            {track.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TrackSelector;