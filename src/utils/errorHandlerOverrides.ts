export const __handleError = (error: unknown) => {
  const errorMessage = error instanceof Error 
    ? `${error.name}: ${error.message}`
    : String(error);

  const errors = [errorMessage];

  const errorStack = error instanceof Error && error.stack;
  if (errorStack) {
    errors.push(`Stack => ${errorStack}`);
  }
  console.error(...errors);
  return true;
};

export const errorHandlerOverrides = () => {
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
