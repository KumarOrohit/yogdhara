export const getUserTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const convertUTCToLocalTime = (utcTimeString: string, timezone: string): Date => {
  return new Date(new Date(utcTimeString).toLocaleString('en-US', { timeZone: timezone }));
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const isCurrentTimeInRange = (startTime: Date, endTime: Date): boolean => {
  const now = new Date();
  return now >= startTime && now <= endTime;
};

export const getCurrentTimePosition = (): number => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return (hours * 60 + minutes) * (100 / (24 * 60)); // Percentage of day passed
};