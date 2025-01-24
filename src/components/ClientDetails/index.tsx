<lov-code>
import React, { useState } from 'react';
import { Client, ClientMetrics, InvestmentTrack } from '@/types/investment';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  PieChart,
  Activity,
  Percent,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { INVESTMENT_TRACKS } from '@/lib/constants';
import { ResponsiveLine } from '@nivo/line';
import { format, isValid, parseISO } from 'date-fns';
import PerformanceChart from '@/components/PerformanceChart';

interface ClientDetailsProps {
  client: Client;
  metrics: ClientMetrics;
}

const ClientDetails = ({ client, metrics }: ClientDetailsProps) => {
  const [comparisonTrack, setComparisonTrack] = useState<InvestmentTrack | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return new Intl.NumberFormat('en', {
      style: 'percent',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value / 100);
  };

  const calculateROI = () => {
    return ((metrics.totalProfit / metrics.totalInvestment) * 100).toFixed(2);
  };

  const getTrackDetails = () => {
    return INVESTMENT