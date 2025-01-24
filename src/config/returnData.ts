const getReturnsForTrack = (trackId: string) => {
  switch (trackId) {
    case 'SPY':
      return SP500_RETURNS;
    case 'VTI':
      return VTI_RETURNS;
    case 'SWTSX':
      return SCHWAB_RETURNS;
    default:
      return NASDAQ_RETURNS;
  }
};

export { getReturnsForTrack };