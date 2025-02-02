import { CONSOLE_METHOD_LIST } from 'constants/console';
import { SetOutputFunction } from 'types/console';
import { createConsoleMethod, createTableMethod, createTimeMethod, createTimeEndMethod } from './methods';

export const overrideConsoleMethods = (setOutput: SetOutputFunction) => {
  CONSOLE_METHOD_LIST.forEach(method => {
    switch (method) {
      case 'table':
        console.table = createTableMethod(setOutput);
        break;
      case 'time':
        console.time = createTimeMethod(setOutput);
        break;
      case 'timeEnd':
        console.timeEnd = createTimeEndMethod(setOutput);
        break;
      default:
        console[method] = createConsoleMethod(method, setOutput);
    }
  });
}; 