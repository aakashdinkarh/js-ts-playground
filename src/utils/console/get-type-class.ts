import type { ConsoleOutputProps } from 'types/console';
import { CONSOLE_METHODS } from '@constants/console';

// Add CSS classes based on console type
export const getTypeClass = (type: ConsoleOutputProps['type']) => {
  switch (type) {
    case CONSOLE_METHODS.ERROR: return 'console-error';
    case CONSOLE_METHODS.WARN: return 'console-warn';
    case CONSOLE_METHODS.INFO: return 'console-info';
    case CONSOLE_METHODS.DEBUG: return 'console-debug';
    case CONSOLE_METHODS.TIME: return 'console-time';
    case CONSOLE_METHODS.TIME_END: return 'console-time';
    default: return '';
  }
};