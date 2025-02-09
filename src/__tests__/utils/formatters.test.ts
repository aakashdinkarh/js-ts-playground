import { formatConsoleValue, formatTimerDuration, formatArrayPreview } from '@utils/console/formatters';

describe('formatters', () => {
  describe('formatConsoleValue', () => {
    it('should format null correctly', () => {
      expect(formatConsoleValue(null)).toBe('null');
    });

    it('should format undefined correctly', () => {
      expect(formatConsoleValue(undefined)).toBe('undefined');
    });

    it('should format strings correctly', () => {
      expect(formatConsoleValue('test')).toBe('test');
      expect(formatConsoleValue('')).toBe('');
    });

    it('should format numbers correctly', () => {
      expect(formatConsoleValue(42)).toBe('42');
      expect(formatConsoleValue(0)).toBe('0');
      expect(formatConsoleValue(-1)).toBe('-1');
      expect(formatConsoleValue(3.14)).toBe('3.14');
    });

    it('should format booleans correctly', () => {
      expect(formatConsoleValue(true)).toBe('true');
      expect(formatConsoleValue(false)).toBe('false');
    });

    it('should format objects with proper indentation', () => {
      const obj = { name: 'John', age: 30 };
      const expected = JSON.stringify(obj, null, 2);
      expect(formatConsoleValue(obj)).toBe(expected);
    });

    it('should format arrays with proper indentation', () => {
      const arr = [1, 2, { x: 1 }];
      const expected = JSON.stringify(arr, null, 2);
      expect(formatConsoleValue(arr)).toBe(expected);
    });

    it('should format nested objects correctly', () => {
      const nested = {
        user: { name: 'John', age: 30 },
        scores: [1, 2, 3]
      };
      const expected = JSON.stringify(nested, null, 2);
      expect(formatConsoleValue(nested)).toBe(expected);
    });
  });

  describe('formatTimerDuration', () => {
    it('should format integer durations correctly', () => {
      expect(formatTimerDuration(100)).toBe('100.00ms');
      expect(formatTimerDuration(0)).toBe('0.00ms');
    });

    it('should format decimal durations correctly', () => {
      expect(formatTimerDuration(100.5)).toBe('100.50ms');
      expect(formatTimerDuration(100.555)).toBe('100.56ms');
    });

    it('should format negative durations correctly', () => {
      expect(formatTimerDuration(-100)).toBe('-100.00ms');
      expect(formatTimerDuration(-100.5)).toBe('-100.50ms');
    });

    it('should format very small durations correctly', () => {
      expect(formatTimerDuration(0.001)).toBe('0.00ms');
      expect(formatTimerDuration(0.009)).toBe('0.01ms');
    });
  });

  describe('formatArrayPreview', () => {
    it('should format empty array correctly', () => {
      expect(formatArrayPreview([])).toBe('');
    });

    it('should format array of primitives correctly', () => {
      expect(formatArrayPreview([1, 2, 3])).toBe('1, 2, 3');
      expect(formatArrayPreview(['a', 'b', 'c'])).toBe('a, b, c');
      expect(formatArrayPreview([true, false])).toBe('true, false');
    });

    it('should format array of mixed types correctly', () => {
      expect(formatArrayPreview([1, 'two', true])).toBe('1, two, true');
    });

    it('should format nested arrays up to 2 levels deep', () => {
      expect(formatArrayPreview([[1, 2], [3, 4]])).toBe('[1, 2], [3, 4]');
      expect(formatArrayPreview([1, [2, 3], 4])).toBe('1, [2, 3], 4');
      expect(formatArrayPreview([[1, [2, 3]], [4, 5]])).toBe('[1, [...]], [4, 5]');
      expect(formatArrayPreview([1, [2, [3, [4]]]])).toBe('1, [2, [...]]');
      expect(formatArrayPreview([[[[1]]], [[[2]]]])).toBe('[[...]], [[...]]');
    });

    it('should handle null and undefined in arrays', () => {
      expect(formatArrayPreview([null, undefined, 1])).toBe('null, undefined, 1');
    });

    it('should handle objects in arrays', () => {
      const obj = { x: 1 };
      expect(formatArrayPreview([obj, 2, 3])).toBe('[object Object], 2, 3');
    });
  });
}); 