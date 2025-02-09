import { __handleError, errorHandlerOverrides } from '../../utils/errorHandlerOverrides';

describe('__handleError', () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('should handle Error objects with stack trace', () => {
    const error = new Error('Test error');
    error.stack = 'Error: Test error\n    at Test.ts:1:1';

    __handleError(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error: Test error',
      'Stack => Error: Test error\n    at Test.ts:1:1'
    );
  });

  it('should handle Error objects without stack trace', () => {
    const error = new Error('Test error');
    error.stack = undefined;

    __handleError(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith('Error: Test error');
  });

  it('should handle non-Error objects', () => {
    const error = { message: 'Custom error' };

    __handleError(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith('[object Object]');
  });

  it('should handle primitive values', () => {
    __handleError('string error');
    expect(consoleErrorSpy).toHaveBeenCalledWith('string error');

    __handleError(123);
    expect(consoleErrorSpy).toHaveBeenCalledWith('123');

    __handleError(null);
    expect(consoleErrorSpy).toHaveBeenCalledWith('null');
  });

  it('should return true', () => {
    expect(__handleError(new Error('Test'))).toBe(true);
  });
});

describe('errorHandlerOverrides', () => {
  let originalSetTimeout: typeof window.setTimeout;
  let originalOnError: typeof window.onerror;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    originalSetTimeout = window.setTimeout;
    originalOnError = window.onerror;
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.useFakeTimers();
  });

  afterEach(() => {
    window.setTimeout = originalSetTimeout;
    window.onerror = originalOnError;
    consoleErrorSpy.mockRestore();
    jest.useRealTimers();
  });

  it('should override setTimeout and handle errors in callback', () => {
    errorHandlerOverrides();

    const errorFn = () => {
      throw new Error('Test timeout error');
    };

    window.setTimeout(errorFn, 100);
    jest.runAllTimers();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error: Test timeout error',
      expect.stringContaining('Stack =>')
    );
  });

  it('should preserve setTimeout behavior for successful callbacks', () => {
    errorHandlerOverrides();
    const mockFn = jest.fn();

    window.setTimeout(mockFn, 100);
    expect(mockFn).not.toHaveBeenCalled();

    jest.runAllTimers();
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should handle string handlers in setTimeout', () => {
    errorHandlerOverrides();
    const handler = 'console.log("test")';
    
    // This should not throw
    expect(() => {
      window.setTimeout(handler, 100);
    }).not.toThrow();
  });

  it('should preserve setTimeout properties', () => {
    errorHandlerOverrides();
    
    expect(typeof window.setTimeout.toString).toBe('function');
    expect(window.setTimeout).toHaveProperty('hasOwnProperty');
  });

  it('should set window.onerror to __handleError', () => {
    errorHandlerOverrides();
    
    expect(window.onerror).toBe(__handleError);
  });
}); 