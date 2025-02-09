type ScriptLoadOptions = {
  async?: boolean;
  defer?: boolean;
  type?: string;
  crossOrigin?: 'anonymous' | 'use-credentials';
};

export const loadScript = (src: string, options: ScriptLoadOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    
    // Apply options
    if (options.async !== undefined) script.async = options.async;
    if (options.defer !== undefined) script.defer = options.defer;
    if (options.type !== undefined) script.type = options.type;
    if (options.crossOrigin !== undefined) script.crossOrigin = options.crossOrigin;

    script.onload = () => resolve();
    script.onerror = () => {
      reject(new Error(`Failed to load script: ${src}`));
      script.remove();
    }

    document.body.appendChild(script);
  });
}; 
