import React from 'react';
import { Card } from '@/components/ui/card';
import { Person } from '@/types/investment';

interface ClientProfileProps {
  person: Person;
}

export const ClientProfile: React.FC<ClientProfileProps> = ({ person }) => {
  return (
    <Card>
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Client Profile</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-gray-400 mb-2">Professional Details</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-400">Profession</dt>
                <dd>{person.profession}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Age Group</dt>
                <dd>{person.ageRange}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Monthly Income</dt>
                <dd>${person.monthlyIncome.toLocaleString()}</dd>
              </div>
            </dl>
          </div>
          <div>
            <h4 className="text-gray-400 mb-2">Investment Profile</h4>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-400">Investment Rate</dt>
                <dd>{(person.investmentPercent * 100).toFixed(1)}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">Annual Return</dt>
                <dd>{(person.annualReturn * 100).toFixed(1)}%</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-400">ROI</dt>
                <dd className="text-green-400">{person.roi.toFixed(1)}%</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </Card>
  );
};