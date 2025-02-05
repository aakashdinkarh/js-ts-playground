export const formatConsoleValue = (value: any): string => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

export const formatTimerDuration = (duration: number): string => {
  return `${duration.toFixed(2)}ms`;
};

export const formatArrayPreview = (arr: any[]): string => {
  return arr.map(item => 
    Array.isArray(item) ? `[${item.join(', ')}]` : item
  ).join(', ');
}; 