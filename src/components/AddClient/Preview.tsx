import React from 'react';
import { Card } from "@/components/ui/card";
import { ChartLineUp, Wallet, Target, TrendingUp } from 'lucide-react';

const Preview = () => {
  return (
    <Card className="bg-card/50 p-6 rounded-lg border border-border/50 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <ChartLineUp className="w-5 h-5 text-primary" />
          <h2 className="font-semibold text-lg">Investment Portfolio Management</h2>
        </div>
        <p className="text-muted-foreground">
          Create and manage personalized investment portfolios tailored to your clients' needs and goals.
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-start gap-3">
          <Wallet className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="font-medium mb-1">Smart Investment Allocation</h3>
            <p className="text-sm text-muted-foreground">Configure monthly investments based on income and risk tolerance</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="font-medium mb-1">Diversified Tracking</h3>
            <p className="text-sm text-muted-foreground">Choose from multiple indices including S&P 500, NASDAQ, and Russell 2000</p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-primary mt-1" />
          <div>
            <h3 className="font-medium mb-1">Performance Analytics</h3>
            <p className="text-sm text-muted-foreground">Track portfolio growth and returns with detailed analytics</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Preview;