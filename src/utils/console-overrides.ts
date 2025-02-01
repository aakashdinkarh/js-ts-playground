import { CONSOLE_METHOD_LIST } from '@constants/index';
import { SetOutputFunction } from 'types/console';


export const overrideConsoleMethods = (setOutput: SetOutputFunction) => {
  const originalMethods = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug,
  };

  // Override all console methods
  CONSOLE_METHOD_LIST.forEach(method => {
    console[method] = (...args) => {
      setOutput(prev => [...prev, { type: method, value: args }]);
      // originalMethods[method](...args); // Keep the original console output
    };
  });

  // Return a function to restore original methods
  return () => {
    CONSOLE_METHOD_LIST.forEach(method => {
      console[method] = originalMethods[method];
    });
  };
}; 