const isMac = navigator?.platform?.toUpperCase()?.indexOf('MAC') >= 0;

export const SHORTCUTS = {
  RUN_CODE: {
    key: 'Enter',
    modifier: isMac ? 'metaKey' : 'ctrlKey',
    display: isMac ? '⌘ + Return' : 'Ctrl + Enter'
  }
} as const; 