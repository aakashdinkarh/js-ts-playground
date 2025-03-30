export const APP_CONSTANTS = {
  TITLE: 'JS/TS Playground',
  GITHUB_URL: 'https://github.com/aakashdinkarh/js-ts-playground',
  DEFAULT_CODE: "// Write your code here\nconsole.log('Hello, World!');",
  GETTING_CODE_MESSAGE: '// Getting code for you... Please wait...',
  FETCHING_FAILED_CODE_MESSAGE: '// Failed to fetch code, please try again',
  EDITOR_CONTENT_DEBOUNCE_DELAY: 2000,
  DIMENSION_CHANGE_THRESHOLD: 50,
  MOBILE_BREAKPOINT: 768,
  CODE_SESSION_API_URL: 'https://central-server-app.vercel.app/api/code',
} as const;

export const LANGUAGES = {
  JAVASCRIPT: 'javascript',
  TYPESCRIPT: 'typescript',
} as const;

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES];

export const CDN_URLS = {
  TYPESCRIPT:
    'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.7.3/typescript.min.js',
} as const;

export type CDNUrl = (typeof CDN_URLS)[keyof typeof CDN_URLS];

export const MAX_SESSION_TITLE_LENGTH = 20;
