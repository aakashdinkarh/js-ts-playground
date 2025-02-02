export const originalMethods = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug,
  table: console.table,
  time: console.time,
  timeEnd: console.timeEnd,
} as const;
