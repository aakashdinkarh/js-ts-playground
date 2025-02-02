export const copyToClipboard = (value: any) => {
  const text = typeof value === 'object' 
    ? JSON.stringify(value, null, 2)
    : String(value);
    
  navigator.clipboard.writeText(text);
}; 