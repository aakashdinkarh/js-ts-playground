export const copyToClipboard = async (value: any) => {
  const text =
    typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);

  await navigator.clipboard.writeText(text);
};

interface ShareResult {
  success: boolean;
  message: string;
}

export const copyShareableLink = async (id: string): Promise<ShareResult> => {
  try {
    // Create a URL with the code as a parameter
    const shareableUrl = new URL(window.location.href);
    shareableUrl.searchParams.set("id", encodeURIComponent(id));

    // Copy the URL to clipboard
    await copyToClipboard(shareableUrl);

    return {
      success: true,
      message: "Link copied to clipboard!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to copy link.",
    };
  }
};
