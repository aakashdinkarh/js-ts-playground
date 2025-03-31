import { CONSOLE_METHOD_LIST } from '@constants/console';
import type { SetOutputFunction } from 'types/console';
import { createConsoleMethod, createTableMethod, createTimeMethod, createTimeEndMethod } from '@utils/console/methods';
import { CONSOLE_METHODS } from '@constants/console';

export const overrideConsoleMethods = (setOutput: SetOutputFunction) => {
  CONSOLE_METHOD_LIST.forEach(method => {
    switch (method) {
      case CONSOLE_METHODS.TABLE:
        console.table = createTableMethod(setOutput);
        break;
      case CONSOLE_METHODS.TIME:
        console.time = createTimeMethod(setOutput);
        break;
      case CONSOLE_METHODS.TIME_END:
        console.timeEnd = createTimeEndMethod(setOutput);
        break;
      default:
        console[method] = createConsoleMethod(method, setOutput);
    }
  });
};
