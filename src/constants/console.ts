export const CONSOLE_METHODS = {
  LOG: 'log',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
  TABLE: 'table',
  TIME: 'time',
  TIME_END: 'timeEnd',
} as const;

export const CONSOLE_METHOD_LIST = Object.values(CONSOLE_METHODS); 
