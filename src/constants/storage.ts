export const STORAGE_KEYS = {
  SELECTED_LANGUAGE: 'selectedLanguage',
  AUTO_RUN: 'autoRun',
  EDITOR_CONTENT: (language: string) => `${language}EditorContent`,
} as const; 