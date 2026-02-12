export const getMinimumIncrement = (currentPrice) => {
  if (currentPrice < 1000) return 10;
  if (currentPrice < 2000) return 100;
  if (currentPrice < 5000) return 250;
  if (currentPrice < 7500) return 500;
  if (currentPrice < 10000) return 750;
  if (currentPrice < 20000) return 1000;
  if (currentPrice < 50000) return 5000;
  if (currentPrice < 100000) return 10000;
  if (currentPrice < 200000) return 25000;
  if (currentPrice < 500000) return 50000;
  if (currentPrice < 1000000) return 100000;
  if (currentPrice < 2000000) return 250000;
  if (currentPrice < 5000000) return 500000;
  if (currentPrice < 10000000) return 1000000;
  if (currentPrice < 20000000) return 2500000;
  if (currentPrice < 50000000) return 5000000;
  if (currentPrice < 100000000) return 10000000;
  if (currentPrice < 200000000) return 25000000;
  if (currentPrice < 500000000) return 50000000;
  if (currentPrice < 1000000000) return 100000000;

  return 100000000; // default for very high bids
};
