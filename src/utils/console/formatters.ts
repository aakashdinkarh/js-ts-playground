export const formatConsoleValue = (value: any): string => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

export const formatTimerDuration = (duration: number): string => {
  return `${duration.toFixed(2)}ms`;
}; 