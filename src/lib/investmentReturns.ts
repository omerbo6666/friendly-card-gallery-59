// Investment return data types
interface ReturnData {
  date: string;
  change: number;
}

// Export return data arrays
export const SP500_RETURNS: ReturnData[] = [
  { date: "2025-01-01", change: 4.27 },
  { date: "2024-12-01", change: -3.35 },
  // ... Add more historical data
];

export const NASDAQ_RETURNS: ReturnData[] = [
  { date: "2025-01-01", change: 4.30 },
  { date: "2024-12-01", change: -3.45 },
  // ... Add more historical data
];

export const RUSSELL_2000_RETURNS: ReturnData[] = [
  { date: "2025-01-01", change: 3.79 },
  { date: "2024-12-01", change: -8.40 },
  // ... Add more historical data
];

export const VTI_RETURNS: ReturnData[] = [
  { date: "2025-01-01", change: 4.27 },
  { date: "2024-12-01", change: -3.35 },
  // ... Add more historical data
];

export const SCHWAB_RETURNS: ReturnData[] = [
  { date: "2025-01-19", change: 2.01 },
  { date: "2025-01-12", change: 3.13 },
  // ... Add more historical data
];

export const IWV_RETURNS: ReturnData[] = [
  { date: "2025-01-01", change: 4.30 },
  { date: "2024-12-01", change: -3.45 },
  // ... Add more historical data
];

export const WFIVX_RETURNS: ReturnData[] = [
  { date: "2025-01-01", change: 4.25 },
  { date: "2024-12-01", change: -5.60 },
  // ... Add more historical data
];