import { loadTypeScriptCompiler } from '@utils/typescript-loader';
import { loadScript } from '@utils/script-loader';
import { __handleError } from '@utils/errorHandlerOverrides';
import { CDN_URLS } from '@constants/app';

// Mock dependencies
jest.mock('@utils/script-loader');
jest.mock('@utils/errorHandlerOverrides');

describe('loadTypeScriptCompiler', () => {
  const mockLoadScript = loadScript as jest.MockedFunction<typeof loadScript>;
  const mockHandleError = __handleError as jest.MockedFunction<typeof __handleError>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    
    // Reset the ts property on window
    delete (window as any).ts;
  });

  it('should return true if TypeScript is already loaded', async () => {
    // Simulate TypeScript already being loaded
    (window as any).ts = {};

    const result = await loadTypeScriptCompiler();

    expect(result).toBe(true);
    expect(mockLoadScript).not.toHaveBeenCalled();
  });

  it('should load TypeScript from CDN if not already loaded', async () => {
    // Setup loadScript to resolve successfully
    mockLoadScript.mockResolvedValueOnce();

    const result = await loadTypeScriptCompiler();

    expect(result).toBe(true);
    expect(mockLoadScript).toHaveBeenCalledWith(CDN_URLS.TYPESCRIPT, {
      async: true,
      crossOrigin: 'anonymous'
    });
  });

  it('should handle loading errors gracefully', async () => {
    // Setup loadScript to reject with an error
    const testError = new Error('Failed to load TypeScript');
    mockLoadScript.mockRejectedValueOnce(testError);

    const result = await loadTypeScriptCompiler();

    expect(result).toBe(false);
    expect(mockHandleError).toHaveBeenCalledWith(testError);
  });

  it('should not load TypeScript multiple times if already loading', async () => {
    // Create multiple concurrent calls
    const loadPromise1 = loadTypeScriptCompiler();
    const loadPromise2 = loadTypeScriptCompiler();
    const loadPromise3 = loadTypeScriptCompiler();

    // Resolve the script load
    mockLoadScript.mockResolvedValueOnce();

    // Wait for all promises to resolve
    const results = await Promise.all([loadPromise1, loadPromise2, loadPromise3]);

    // All calls should succeed
    expect(results).toEqual([true, true, true]);
    // But loadScript should only be called once
    expect(mockLoadScript).toHaveBeenCalledTimes(1);
  });

  it('should set correct options when loading script', async () => {
    mockLoadScript.mockResolvedValueOnce();

    await loadTypeScriptCompiler();

    expect(mockLoadScript).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        async: true,
        crossOrigin: 'anonymous'
      })
    );
  });

  it('should use correct CDN URL', async () => {
    mockLoadScript.mockResolvedValueOnce();

    await loadTypeScriptCompiler();

    expect(mockLoadScript).toHaveBeenCalledWith(
      CDN_URLS.TYPESCRIPT,
      expect.any(Object)
    );
  });
}); 