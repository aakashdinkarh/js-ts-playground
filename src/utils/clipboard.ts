import { SHARE_BUTTON_TEXT } from '@constants/button';

const checkClipboardPermission = async (): Promise<boolean> => {
  // Check if clipboard API is available
  if (!navigator.clipboard) {
    return false;
  }

  // Check if we're in a secure context (HTTPS or localhost)
  if (!window.isSecureContext) {
    return false;
  }

  // Check if permissions API is available
  if (navigator.permissions) {
    try {
      const result = await navigator.permissions.query({
        name: 'clipboard-write' as PermissionName,
      });
      return result.state === 'granted' || result.state === 'prompt';
    } catch (error) {
      // If permission query fails, we'll try the operation anyway
      return true;
    }
  }

  // If permissions API is not available, return true to try the operation
  return true;
};

export const copyToClipboard = async (value: any): Promise<boolean> => {
  const text = typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value);

  try {
    // First try using the modern Clipboard API
    if (await checkClipboardPermission()) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    // Fallback: Use execCommand (for older browsers and some mobile browsers)
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      return successful;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
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
  try {
    // Create a URL with the code as a parameter
    const shareableUrl = new URL(window.location.href);
    shareableUrl.searchParams.set('id', encodeURIComponent(id));

    // Copy to clipboard
    const copied = await copyToClipboard(shareableUrl.toString());

    return {
      success: copied,
      message: copied ? SHARE_BUTTON_TEXT.SUCCESS : SHARE_BUTTON_TEXT.FAILED,
    };
  } catch (error) {
    console.error('Copy failed:', error);
    return {
      success: false,
      message: SHARE_BUTTON_TEXT.FAILED,
    };
  }
};
