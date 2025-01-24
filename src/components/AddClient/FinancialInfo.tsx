import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FinancialInfoProps {
  monthlyExpenses: string;
  investmentPercentage: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FinancialInfo = ({
  monthlyExpenses,
  investmentPercentage,
  onInputChange
}: FinancialInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="monthlyExpenses">Monthly Expenses (ILS)</Label>
        <Input
          id="monthlyExpenses"
          name="monthlyExpenses"
          type="number"
          placeholder="Enter monthly expenses"
          value={monthlyExpenses}
          onChange={onInputChange}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="investmentPercentage">Investment Percentage (%)</Label>
        <Input
          id="investmentPercentage"
          name="investmentPercentage"
          type="number"
          placeholder="Enter investment percentage"
          value={investmentPercentage}
          onChange={onInputChange}
          min="1"
          max="100"
        />
      </div>
    </div>
  );
};

export default FinancialInfo;