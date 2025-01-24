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
    id: 'SPY',
    name: 'S&P 500 Index Fund',
    description: 'Tracks the performance of 500 large companies listed on U.S. stock exchanges',
    benchmark: 'S&P 500 Index',
    type: 'ETF',
    expenseRatio: '0.09%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'Technology, Healthcare, Financial Services, Consumer Discretionary'
  },
  {
    id: 'QQQ',
    name: 'NASDAQ 100 Index Fund',
    description: 'Tracks 100 of the largest non-financial companies listed on the NASDAQ',
    benchmark: 'NASDAQ-100 Index',
    type: 'ETF',
    expenseRatio: '0.20%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Meta',
    sectors: 'Technology, Communication Services, Consumer Discretionary'
  },
  {
    id: 'IWM',
    name: 'Russell 2000 Small Cap Index',
    description: 'Tracks 2000 small-cap companies in the U.S. market',
    benchmark: 'Russell 2000 Index',
    type: 'ETF',
    expenseRatio: '0.19%',
    topHoldings: 'Super Micro Computer, Abercrombie & Fitch, Rambus',
    sectors: 'Financials, Healthcare, Industrials, Technology'
  },
  {
    id: 'VTSAX',
    name: 'Vanguard Total Stock Market Index',
    description: 'Provides broad exposure to the entire U.S. equity market',
    benchmark: 'CRSP US Total Market Index',
    type: 'Mutual Fund',
    expenseRatio: '0.04%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'All U.S. market sectors'
  },
  {
    id: 'VTI',
    name: 'Vanguard Total Stock Market ETF',
    description: 'ETF version of VTSAX, tracking the entire U.S. stock market',
    benchmark: 'CRSP US Total Market Index',
    type: 'ETF',
    expenseRatio: '0.03%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'All U.S. market sectors'
  },
  {
    id: 'SWTSX',
    name: 'Schwab Total Stock Market Index',
    description: 'Comprehensive coverage of the entire U.S. equity market',
    benchmark: 'Dow Jones U.S. Total Stock Market Index',
    type: 'Mutual Fund',
    expenseRatio: '0.03%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'All U.S. market sectors'
  },
  {
    id: 'IWV',
    name: 'iShares Russell 3000 ETF',
    description: 'Tracks 3000 of the largest U.S. companies',
    benchmark: 'Russell 3000 Index',
    type: 'ETF',
    expenseRatio: '0.20%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'All U.S. market sectors'
  },
  {
    id: 'WFIVX',
    name: 'Wilshire 5000 Index Fund',
    description: 'Tracks the entire U.S. stock market',
    benchmark: 'Wilshire 5000 Total Market Index',
    type: 'Mutual Fund',
    expenseRatio: '0.63%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'All U.S. market sectors'
  }
];