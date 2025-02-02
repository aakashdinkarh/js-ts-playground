export const errorHandlerOverrides = () => {
  const __handleError = (error: unknown) => {
    console.error(
      error instanceof Error 
        ? `${error.name}: ${error.message}\n${error.stack}`
        : String(error)
    );
    return true;
  };

  // Preserve setTimeout's type
  const originalSetTimeout = window.setTimeout;
  const newSetTimeout = function(handler: TimerHandler, timeout?: number, ...args: any[]) {
    const wrappedHandler = typeof handler === 'function' 
      ? function(this: any) { 
          try {
            handler.apply(this, args);
          } catch (error) {
            __handleError(error);
          }
        }
      : handler;
    
    return originalSetTimeout(wrappedHandler, timeout, ...args);
  };

  // Preserve setTimeout's properties
  Object.assign(newSetTimeout, originalSetTimeout);
  window.setTimeout = newSetTimeout as typeof originalSetTimeout;

  window.onerror = __handleError;
}
