import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROFESSIONS } from '@/lib/constants';

interface ClientBasicInfoProps {
  name: string;
  profession: string;
  customProfession: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectChange: (name: string, value: string) => void;
}

const ClientBasicInfo = ({
  name,
  profession,
  customProfession,
  onInputChange,
  onSelectChange
}: ClientBasicInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Client Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Enter client name"
          value={name}
          onChange={onInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="profession">Profession</Label>
        <Select
          value={profession}
          onValueChange={(value) => onSelectChange('profession', value)}
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

      {profession === 'Other' && (
        <div className="grid gap-2">
          <Label htmlFor="customProfession">Specify Profession</Label>
          <Input
            id="customProfession"
            name="customProfession"
            placeholder="Enter profession"
            value={customProfession}
            onChange={onInputChange}
          />
        </div>
      )}
    </div>
  );
};

export default ClientBasicInfo;