export const BUTTON_VARIANTS = {
  PRIMARY: 'primary',
  ICON: 'icon',
} as const;

export enum SHARE_BUTTON_TEXT {
  SHARE = 'Share',
  COPYING = 'Copying...',
  COPIED = 'Copied!',
  SUCCESS = '✅ Link copied to clipboard!',
  FAILED = '❌ Failed to copy link.',
  ERROR = 'Something went wrong! Try again.',
}
