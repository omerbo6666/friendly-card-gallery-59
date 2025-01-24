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
    id: 'SPY500',
    name: 'S&P 500 Index',
    description: 'Tracks the performance of 500 large companies listed on U.S. stock exchanges',
    benchmark: 'S&P 500 Index',
    type: 'ETF',
    expenseRatio: 'Very Low',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'Technology, Healthcare, Financial Services, Consumer Discretionary'
  },
  {
    id: 'NASDAQ100',
    name: 'NASDAQ 100',
    description: 'Tracks 100 of the largest non-financial companies listed on the NASDAQ',
    benchmark: 'NASDAQ 100 Index',
    type: 'ETF',
    expenseRatio: 'Very Low',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Meta',
    sectors: 'Technology, Consumer Services, Healthcare'
  },
  {
    id: 'RUSSELL2000',
    name: 'Russell 2000',
    description: 'Tracks 2000 small-cap company stocks',
    benchmark: 'Russell 2000 Index',
    type: 'ETF',
    expenseRatio: 'Low',
    topHoldings: 'Diverse small-cap companies',
    sectors: 'Financial Services, Healthcare, Technology, Real Estate'
  }
] as const;

export type InvestmentTrack = typeof INVESTMENT_TRACKS[number]['id'];