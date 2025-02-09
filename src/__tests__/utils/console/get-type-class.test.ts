import { getTypeClass } from '@utils/console/get-type-class';
import { CONSOLE_METHODS } from '@constants/console';

describe('getTypeClass', () => {
  it('should return correct class for error type', () => {
    expect(getTypeClass(CONSOLE_METHODS.ERROR)).toBe('console-error');
  });

  it('should return correct class for warn type', () => {
    expect(getTypeClass(CONSOLE_METHODS.WARN)).toBe('console-warn');
  });

  it('should return correct class for info type', () => {
    expect(getTypeClass(CONSOLE_METHODS.INFO)).toBe('console-info');
  });

  it('should return correct class for debug type', () => {
    expect(getTypeClass(CONSOLE_METHODS.DEBUG)).toBe('console-debug');
  });

  it('should return correct class for time type', () => {
    expect(getTypeClass(CONSOLE_METHODS.TIME)).toBe('console-time');
  });

  it('should return correct class for timeEnd type', () => {
    expect(getTypeClass(CONSOLE_METHODS.TIME_END)).toBe('console-time');
  });

  it('should return empty string for unknown type', () => {
    expect(getTypeClass(CONSOLE_METHODS.LOG)).toBe('');
    expect(getTypeClass(CONSOLE_METHODS.TABLE)).toBe('');
  });
}); 