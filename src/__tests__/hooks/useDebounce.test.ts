import { renderHook } from '@testing-library/react';
import { useDebounce } from '@hooks/useDebounce';

describe('useDebounce Hook', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should debounce function calls', () => {
    const callback = jest.fn();
    const delay = 1000;

    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    // Call the debounced function multiple times
    debouncedFn('test1');
    debouncedFn('test2');
    debouncedFn('test3');

    // Function should not have been called yet
    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(delay);

    // Function should have been called once with the last value
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('test3');
  });

  it('should handle multiple debounced calls with different delays', () => {
    const callback = jest.fn();
    const delay = 500;

    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    // First call
    debouncedFn('first');
    jest.advanceTimersByTime(200);

    // Second call before first delay is complete
    debouncedFn('second');
    jest.advanceTimersByTime(200);

    // Function should not have been called yet
    expect(callback).not.toHaveBeenCalled();

    // Complete the delay for the second call
    jest.advanceTimersByTime(300);

    // Function should have been called once with the second value
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
  });

  it('should cleanup timeout on unmount', () => {
    const callback = jest.fn();
    const delay = 1000;

    const { unmount } = renderHook(() => useDebounce(callback, delay));

    // Unmount the hook
    unmount();

    // Advance time
    jest.advanceTimersByTime(delay);

    // Callback should not be called after unmount
    expect(callback).not.toHaveBeenCalled();
  });

  it('should handle zero delay', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback, 0));
    const debouncedFn = result.current;

    debouncedFn('test');
    jest.advanceTimersByTime(0);

    expect(callback).toHaveBeenCalledWith('test');
  });

  it('should handle first call (no existing timeout)', () => {
    const callback = jest.fn();
    const delay = 500;
    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    // First call - no existing timeout to clear
    debouncedFn('first');
    jest.advanceTimersByTime(delay);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('first');
  });

  it('should clear existing timeout on subsequent calls', () => {
    const callback = jest.fn();
    const delay = 500;
    const { result } = renderHook(() => useDebounce(callback, delay));
    const debouncedFn = result.current;

    // First call
    debouncedFn('first');
    jest.advanceTimersByTime(200); // Advance part way

    // Second call - should clear existing timeout
    debouncedFn('second');
    jest.advanceTimersByTime(delay);

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('second');
    expect(callback).not.toHaveBeenCalledWith('first');
  });

  it('should use default delay when no delay is provided', () => {
    const callback = jest.fn();
    const { result } = renderHook(() => useDebounce(callback)); // No delay provided
    const debouncedFn = result.current;

    debouncedFn('test');
    jest.advanceTimersByTime(499); // Just before default delay
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1); // Complete default delay (500ms)
    expect(callback).toHaveBeenCalledWith('test');
  });
}); 
