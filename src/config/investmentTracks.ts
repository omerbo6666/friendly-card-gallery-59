import { InvestmentTrack } from '@/types/investment';

export enum InvestmentTrackType {
  ETF = 'ETF',
  MUTUAL_FUND = 'Mutual Fund',
  INDEX = 'Index'
}

export const INVESTMENT_TRACKS = [
  {
    id: 'SWTSX',
    name: 'Schwab Total Stock Market Index',
    description: 'Comprehensive coverage of the entire U.S. equity market',
    benchmark: 'Dow Jones U.S. Total Stock Market Index',
    type: InvestmentTrackType.MUTUAL_FUND,
    expenseRatio: '0.03%',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'All U.S. market sectors'
  },
  {
    id: 'SPY500',
    name: 'S&P 500 Index Fund',
    description: 'Tracks the performance of 500 large companies listed on U.S. stock exchanges',
    benchmark: 'S&P 500 Index',
    type: InvestmentTrackType.ETF,
    expenseRatio: 'Very Low',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'Technology, Healthcare, Financial Services, Consumer Discretionary'
  },
  {
    id: 'Vanguard Total Stock Market ETF',
    name: 'Vanguard Total Stock Market ETF',
    description: 'Provides broad exposure to the entire U.S. equity market',
    benchmark: 'CRSP US Total Market Index',
    type: InvestmentTrackType.ETF,
    expenseRatio: 'Very Low',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Alphabet',
    sectors: 'All U.S. market sectors'
  },
  {
    id: 'NASDAQ',
    name: 'NASDAQ Composite Index',
    description: 'Tracks all stocks listed on the NASDAQ stock market',
    benchmark: 'NASDAQ Composite',
    type: InvestmentTrackType.INDEX,
    expenseRatio: 'Low',
    topHoldings: 'Apple, Microsoft, Amazon, NVIDIA, Meta',
    sectors: 'Technology, Consumer Services, Healthcare'
  },
];

export const getInvestmentTrack = (id: string) => {
  return INVESTMENT_TRACKS.find(track => track.id === id);
};

export const validateInvestmentTrack = (id: string): boolean => {
  return INVESTMENT_TRACKS.some(track => track.id === id);
};
