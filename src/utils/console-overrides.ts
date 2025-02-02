import { CONSOLE_METHOD_LIST } from '@constants/index';
import { SetOutputFunction, TimeData } from 'types/console';

const timeData: TimeData = {};
const originalMethods = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
  table: console.table,
  time: console.time,
  timeEnd: console.timeEnd,
};

export const overrideConsoleMethods = (setOutput: SetOutputFunction) => {
  // Override all console methods
  CONSOLE_METHOD_LIST.forEach(method => {
    if (method === 'table') {
      console.table = (...args) => {
        setOutput(prev => [...prev, { 
          type: 'table', 
          value: Array.isArray(args[0]) ? args[0] : [args[0]]
        }]);
      };
      return;
    }

    if (method === 'time') {
      console.time = (label = 'default') => {
        timeData[label] = performance.now();
        setOutput(prev => [...prev, { 
          type: 'time', 
          value: [`Timer '${label}' started`]
        }]);
      };
      return;
    }

    if (method === 'timeEnd') {
      console.timeEnd = (label = 'default') => {
        if (timeData[label]) {
          const duration = performance.now() - timeData[label];
          delete timeData[label];
          setOutput(prev => [...prev, { 
            type: 'timeEnd', 
            value: [`Timer '${label}': ${duration.toFixed(2)}ms`]
          }]);
          return;
        }

        setOutput(prev => [...prev, { 
          type: 'error', 
          value: [`Timer '${label}' does not exist`]
        }]);
      };
      return;
    } 

    console[method] = (...args) => {
      setOutput(prev => [...prev, { 
        type: method, 
        value: args 
      }]);
    };
  });

  // Return a function to restore original methods
  return () => {
    CONSOLE_METHOD_LIST.forEach(method => {
      console[method] = originalMethods[method];
    });
  };
}; 