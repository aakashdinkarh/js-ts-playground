export const formatConsoleValue = (value: any): string => {
  if (typeof value === 'object' && value !== null) {
    return JSON.stringify(value, null, 2);
  }
  return String(value);
};

export const formatTimerDuration = (duration: number): string => {
  return `${duration.toFixed(2)}ms`;
};

export const formatArrayPreview = (arr: any[], depth: number = 0): string => {
  return arr.map(item => {
    if (Array.isArray(item)) {
      if (depth >= 1) {
        return '[...]';
      }
      return `[${formatArrayPreview(item, depth + 1)}]`;
    }
    return String(item);
  }).join(', ');
}; 