export const APP_CONSTANTS = {
  TITLE: 'JS/TS Playground',
  GITHUB_URL: 'https://github.com/aakashdinkarh/js-ts-playground',
  DEFAULT_CODE: '// Write your code here\nconsole.log(\'Hello, World!\');',
  EDITOR_CONTENT_DEBOUNCE_DELAY: 2000,
} as const;

export const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
} as const;

export type Language = typeof LANGUAGES[keyof typeof LANGUAGES];
