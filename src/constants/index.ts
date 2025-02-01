export const APP_CONSTANTS = {
  TITLE: 'JS/TS Playground',
  GITHUB_URL: 'https://github.com/aakashdinkarh/js-ts-playground',
  DEFAULT_CODE: '// Write your code here\nconsole.log(\'Hello, World!\');',
  AUTO_RUN_DELAY: 2000,
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
