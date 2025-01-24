export const PROFESSIONS = [
  'Software Engineer',
  'Doctor',
  'Lawyer',
  'Teacher',
  'Business Owner',
  'Financial Advisor',
  'Architect',
  'Designer',
  'Sales Representative',
  'Marketing Manager'
];

export const INVESTMENT_TRACKS = [
  {
    id: 'SPY500',
    name: 'S&P 500 Index Fund',
    description: 'Tracks the performance of 500 large companies listed on U.S. stock exchanges',
    benchmark: 'S&P 500 Index',
    type: 'ETF',
    expenseRatio: 'Very Low',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'Technology, Healthcare, Financial Services, Consumer Discretionary'
  },
  {
    id: 'Vanguard Total Stock Market ETF',
    name: 'Vanguard Total Stock Market ETF',
    description: 'Provides broad exposure to the entire U.S. equity market',
    benchmark: 'CRSP US Total Market Index',
    type: 'ETF',
    expenseRatio: 'Very Low',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'All U.S. market sectors'
  },
  {
    id: 'NASDAQ',
    name: 'NASDAQ Composite Index',
    description: 'Tracks all stocks listed on the NASDAQ stock market',
    benchmark: 'NASDAQ Composite',
    type: 'ETF',
    expenseRatio: 'Low',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Meta',
    sectors: 'Technology, Consumer Services, Healthcare'
  },
  {
    id: 'Schwab Total Stock Market Index',
    name: 'Schwab Total Stock Market Index',
    description: 'Comprehensive coverage of the entire U.S. equity market',
    benchmark: 'Dow Jones U.S. Total Stock Market Index',
    type: 'Mutual Fund',
    expenseRatio: 'Very Low',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'All U.S. market sectors'
  }
];