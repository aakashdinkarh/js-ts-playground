import { SHARE_BUTTON_TEXT } from '@constants/button';

export const copyToClipboard = async (value: any): Promise<boolean> => {
  const text = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);

  try {
    // First try using the modern Clipboard API
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy text:', error);
    return false;
  }
};

interface ShareResult {
  success: boolean;
  message: SHARE_BUTTON_TEXT.SUCCESS | SHARE_BUTTON_TEXT.FAILED;
}

export const copyShareableLink = async (id: string): Promise<ShareResult> => {
  // Create a URL with the code as a parameter
  const shareableUrl = new URL(window.location.href);
  shareableUrl.searchParams.set('id', encodeURIComponent(id));

  try {
    // Copy to clipboard
    const copied = await copyToClipboard(shareableUrl.toString());

    if (!copied) {
      console.log(
        'Copy failed, please select the text and copy it manually:',
        shareableUrl.toString()
      );
    }

    return {
      success: copied,
      message: copied ? SHARE_BUTTON_TEXT.SUCCESS : SHARE_BUTTON_TEXT.FAILED,
    };
  } catch (error) {
    console.log(
      'Copy failed, please select the text and copy it manually:',
      shareableUrl.toString()
    );

    console.error('Copy failed Error:', error);
    return {
      success: false,
      message: SHARE_BUTTON_TEXT.FAILED,
    };
  }
};
