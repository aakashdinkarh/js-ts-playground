import { loadScript } from '@utils/script-loader';

describe('loadScript', () => {
  let appendChildSpy: jest.SpyInstance;
  let createElementSpy: jest.SpyInstance;
  let mockScript: HTMLScriptElement;

  beforeEach(() => {
    mockScript = document.createElement('script');
    Object.defineProperties(mockScript, {
      src: { writable: true, value: '' },
      async: { writable: true, value: false },
      defer: { writable: true, value: false },
      type: { writable: true, value: '' },
      crossOrigin: { writable: true, value: null },
      remove: { value: jest.fn() }
    });

    createElementSpy = jest.spyOn(document, 'createElement').mockImplementation(() => mockScript);
    appendChildSpy = jest.spyOn(document.body, 'appendChild').mockImplementation(() => mockScript);
  });

  afterEach(() => {
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
  });

  it('should create and append script element with correct src', async () => {
    const scriptSrc = 'https://example.com/script.js';
    const loadPromise = loadScript(scriptSrc);
    
    expect(createElementSpy).toHaveBeenCalledWith('script');
    expect(mockScript.src).toBe(scriptSrc);
    expect(appendChildSpy).toHaveBeenCalledWith(mockScript);

    // Simulate successful load
    mockScript.onload!(new Event('load'));
    await expect(loadPromise).resolves.toBeUndefined();
  });

  it('should handle script load error', async () => {
    const scriptSrc = 'https://example.com/script.js';
    const loadPromise = loadScript(scriptSrc);
    
    // Simulate load error
    mockScript.onerror!(new Event('error'));
    
    await expect(loadPromise).rejects.toThrow(`Failed to load script: ${scriptSrc}`);
    expect(mockScript.remove).toHaveBeenCalled();
  });

  it('should apply async option when provided', async () => {
    const loadPromise = loadScript('https://example.com/script.js', { async: true });
    
    // Simulate successful load to complete the promise
    mockScript.onload!(new Event('load'));
    await loadPromise;
    expect(mockScript.async).toBe(true);
  });

  it('should apply defer option when provided', async () => {
    const loadPromise = loadScript('https://example.com/script.js', { defer: true });
    // Simulate successful load to complete the promise
    mockScript.onload!(new Event('load'));
    await loadPromise;
    
    expect(mockScript.defer).toBe(true);
  });

  it('should apply type option when provided', async () => {
    const scriptType = 'module';
    const loadPromise = loadScript('https://example.com/script.js', { type: scriptType });
    // Simulate successful load to complete the promise
    mockScript.onload!(new Event('load'));
    await loadPromise;
    
    expect(mockScript.type).toBe(scriptType);
  });

  it('should apply crossOrigin option when provided', async () => {
    const loadPromise1 = loadScript('https://example.com/script.js', { crossOrigin: 'anonymous' });
    mockScript.onload!(new Event('load'));
    await loadPromise1;
    expect(mockScript.crossOrigin).toBe('anonymous');

    const loadPromise2 = loadScript('https://example.com/script.js', { crossOrigin: 'use-credentials' });
    mockScript.onload!(new Event('load'));
    await loadPromise2;
    expect(mockScript.crossOrigin).toBe('use-credentials');
  });

  it('should not apply undefined options', async () => {
    const initialCrossOrigin = mockScript.crossOrigin;
    const initialType = mockScript.type;
    
    const loadPromise = loadScript('https://example.com/script.js', {});
    // Simulate successful load to complete the promise
    mockScript.onload!(new Event('load'));
    await loadPromise;

    expect(mockScript.crossOrigin).toBe(initialCrossOrigin);
    expect(mockScript.type).toBe(initialType);
  });
}); 