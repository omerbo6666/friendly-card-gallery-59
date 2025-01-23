export const PROFESSIONS = [
  'Software Engineer',
  'Doctor',
  'Lawyer',
  'Business Owner',
  'Teacher',
  'Data Scientist',
  'Financial Analyst',
  'Marketing Manager',
  'Product Manager',
  'Sales Executive',
  'HR Manager',
  'Architect',
  'Consultant',
  'Accountant',
  'Research Scientist',
  'Other'
];

export const INVESTMENT_TRACKS = [
  {
    name: 'Nasdaq 100',
    return: 11.3,
    description: 'Nasdaq 100 - 11.3% Annual return'
  },
  {
    name: 'S&P 500',
    return: 7.7,
    description: 'S&P 500 - 7.7% Annual return'
  },
  {
    name: 'Tech Sector',
    return: 14.0,
    description: 'Top 10 stocks Tech sector - 14% Annual return'
  },
  {
    name: 'Long Term Bonds',
    return: 3.0,
    description: 'Long term bonds - 3% Annual return'
  },
  {
    name: 'Mixed Portfolio',
    return: 5.0,
    description: 'Short term bond + S&P 500 - 5% Annual return'
  }
] as const;

export type InvestmentTrack = typeof INVESTMENT_TRACKS[number]['name'];