import { SHARE_BUTTON_TEXT } from '@constants/button';

export const copyToClipboard = async (value: any) => {
  const text =
    typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);

  await navigator.clipboard.writeText(text);
};

interface ShareResult {
  success: boolean;
  message: SHARE_BUTTON_TEXT.COPIED | SHARE_BUTTON_TEXT.FAILED;
}

export const copyShareableLink = async (id: string): Promise<ShareResult> => {
  try {
    // Create a URL with the code as a parameter
    const shareableUrl = new URL(window.location.href);
    shareableUrl.searchParams.set('id', encodeURIComponent(id));

    // Copy the URL to clipboard
    await copyToClipboard(shareableUrl);

    return {
      success: true,
      message: SHARE_BUTTON_TEXT.COPIED,
    };
  } catch (error) {
    return {
      success: false,
      message: SHARE_BUTTON_TEXT.FAILED,
    };
  }
};
