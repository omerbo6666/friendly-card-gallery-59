export const PROFESSIONS = [
  'Software Engineer',
  'Doctor',
  'Lawyer',
  'Business Owner',
  'Teacher',
  'Architect',
  'Financial Advisor',
  'Chef',
  'Pilot',
  'Nurse',
  'Dentist',
  'Pharmacist',
  'Real Estate Agent',
  'Graphic Designer',
  'Other'
] as const;

export const INVESTMENT_TRACKS = [
  {
    id: 'VTSAX',
    name: 'Comprehensive U.S. Market Mutual Fund (VTSAX)',
    description: 'Vanguard Total Stock Market Index Admiral Shares',
    benchmark: 'CRSP U.S. Total Market Index',
    type: 'Mutual Fund',
    expenseRatio: 'Low',
    topHoldings: 'Apple (6.14%), Microsoft (5.71%), NVIDIA (5.14%), Alphabet (3.22%), Amazon (3.08%)',
    sectors: 'Broad market exposure across all sectors'
  },
  {
    id: 'VTI',
    name: 'Accessible U.S. Market ETF (VTI)',
    description: 'Vanguard Total Stock Market ETF',
    benchmark: 'CRSP U.S. Total Market Index',
    type: 'ETF',
    expenseRatio: 'Low',
    topHoldings: 'Similar to VTSAX',
    sectors: 'Broad market exposure across all sectors'
  },
  {
    id: 'SWTSX',
    name: 'Low-Cost Schwab Broad Market Fund (SWTSX)',
    description: 'Schwab Total Stock Market Index',
    benchmark: 'Dow Jones U.S. Total Stock Market Index',
    type: 'Mutual Fund',
    expenseRatio: 'Low',
    topHoldings: 'Apple (6.3%), Microsoft (5.68%), NVIDIA (5.31%), Amazon (3.09%), Alphabet (3.16%)',
    sectors: 'Technology (31.25%), Financial Services (12.91%), Healthcare (11.73%), Consumer Discretionary (10.41%), Industrials (8.71%)'
  },
  {
    id: 'IWV',
    name: 'Russell 3000 Broad Market ETF (IWV)',
    description: 'iShares Russell 3000 ETF',
    benchmark: 'Russell 3000 Index',
    type: 'ETF',
    expenseRatio: 'Low',
    topHoldings: 'Apple (6.05%), Microsoft (5.55%), NVIDIA (5.48%), Alphabet (3.19%), Amazon (3.10%)',
    sectors: 'Similar to VTSAX and SWTSX'
  },
  {
    id: 'WFIVX',
    name: 'Wilshire 5000 Comprehensive Market Fund (WFIVX)',
    description: 'FT Wilshire 5000 Index Portfolio Investment Fund',
    benchmark: 'Wilshire 5000 Index',
    type: 'Mutual Fund',
    expenseRatio: 'Moderate',
    topHoldings: 'Broad range of U.S.-traded stocks',
    sectors: 'Comprehensive exposure to all actively traded U.S.-headquartered stocks'
  }
] as const;

export type InvestmentTrack = typeof INVESTMENT_TRACKS[number]['id'];