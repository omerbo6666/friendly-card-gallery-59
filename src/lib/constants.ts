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
    description: 'Nasdaq 100'
  },
  {
    name: 'S&P 500',
    return: 7.7,
    description: 'S&P 500'
  },
  {
    name: 'Tech Sector',
    return: 14.0,
    description: 'Top 10 stocks Tech sector'
  },
  {
    name: 'Long Term Bonds',
    return: 3.0,
    description: 'Long term bonds'
  },
  {
    name: 'Mixed Portfolio',
    return: 5.0,
    description: 'Short term bond + S&P 500'
  }
] as const;

export type InvestmentTrack = typeof INVESTMENT_TRACKS[number]['name'];