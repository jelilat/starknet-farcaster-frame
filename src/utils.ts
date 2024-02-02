export const BASE_URL = process.env.BASE_URL || "";

export const timeValid = (timestamp: number): boolean => {
  // Farcaster epoch starts on Jan 1, 2021
  const farcasterEpochStart = new Date("2021-01-01T00:00:00Z").getTime() / 1000;
  const currentTimestamp = Math.floor(Date.now() / 1000) - farcasterEpochStart; // Current time in seconds since Farcaster epoch
  const thirtyMinutes = 3000 * 60; // 30 minutes in seconds

  return currentTimestamp - timestamp <= thirtyMinutes;
};
