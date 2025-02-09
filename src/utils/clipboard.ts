export const copyToClipboard = async (value: any) => {
  const text = typeof value === 'object' 
    ? JSON.stringify(value, null, 2)
    : String(value);

  await navigator.clipboard.writeText(text);
}; 