export const APP_CONSTANTS = {
  TITLE: 'JS/TS Playground',
  GITHUB_URL: 'https://github.com/aakashdinkarh/js-ts-playground',
  DEFAULT_CODE: '// Write your code here\nconsole.log(\'Hello, World!\');',
  AUTO_RUN_DELAY: 1000, // consider EDITOR_CONTENT_DEBOUNCE_DELAY as 1000ms overall delay becomes 2000ms
  EDITOR_CONTENT_DEBOUNCE_DELAY: 1000,
} as const;

export const STORAGE_KEYS = {
  SELECTED_LANGUAGE: 'selectedLanguage',
  AUTO_RUN: 'autoRun',
  EDITOR_CONTENT: (language: string) => `${language}EditorContent`,
} as const;

export const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];

export const CONSOLE_METHODS = {
  LOG: 'log',
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

export const CONSOLE_METHOD_LIST = [
  CONSOLE_METHODS.LOG,
  CONSOLE_METHODS.ERROR,
  CONSOLE_METHODS.WARN,
  CONSOLE_METHODS.INFO,
  CONSOLE_METHODS.DEBUG,
] as const;
