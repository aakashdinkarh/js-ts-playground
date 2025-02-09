/**
 * Gets unique keys from array of objects while preserving order of first occurrence
 */
export const getTableHeaders = (value: any[]): string[] => {
  // For primitive arrays, use a single 'value' column
  if (value.every(item => typeof item !== 'object' || item === null)) {
    return ['value'];
  }

  // Get all unique keys while preserving order of first occurrence
  return value.reduce((keys: string[], item) => {
    if (typeof item === 'object' && item !== null) {
      Object.keys(item).forEach(key => {
        if (!keys.includes(key)) {
          keys.push(key);
        }
      });
    }
    return keys;
  }, []);
};

/**
 * Checks if array contains only primitive values or null
 */
export const isPrimitiveArray = (value: any[]): boolean => {
  return value.every(item => typeof item !== 'object' || item === null);
};

/**
 * Gets cell value from row data
 */
export const getCellValue = (row: any, header: string, isPrimitive: boolean): any => {
  if (isPrimitive) {
    return row;
  }
  return typeof row === 'object' && row !== null ? row[header] : undefined;
}; 