import { ConsoleMethodType, SetOutputFunction, TimeData } from 'types/console';
import { formatTimerDuration } from '@utils/console/formatters';

const timeData: TimeData = {};

export const createConsoleMethod = (
  type: ConsoleMethodType,
  setOutput: SetOutputFunction
) => {
  return (...args: any[]) => {
    setOutput(prev => [...prev, { type, value: args }]);
  };
};

export const createTableMethod = (setOutput: SetOutputFunction) => {
  return (...args: any[]) => {
    setOutput(prev => [...prev, {
      type: 'table',
      value: Array.isArray(args[0]) ? args[0] : [args[0]]
    }]);
  };
};

export const createTimeMethod = (setOutput: SetOutputFunction) => {
  return (label = 'default') => {
    timeData[label] = performance.now();
    setOutput(prev => [...prev, {
      type: 'time',
      value: [`Timer '${label}' started`]
    }]);
  };
};

export const createTimeEndMethod = (setOutput: SetOutputFunction) => {
  return (label = 'default') => {
    if (timeData[label]) {
      const duration = performance.now() - timeData[label];
      delete timeData[label];
      setOutput(prev => [...prev, {
        type: 'timeEnd',
        value: [`Timer '${label}': ${formatTimerDuration(duration)}`]
      }]);
      return;
    }
    setOutput(prev => [...prev, {
      type: 'error',
      value: [`Timer '${label}' does not exist`]
    }]);
  };
}; 