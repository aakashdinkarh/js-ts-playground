import { checkEditorErrors } from '@utils/monaco';
import { MarkerSeverity } from '@constants/monaco';
import { mockEditor } from '../../setupTests';

describe('Monaco Utils', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.editor = mockEditor as any;
    window.monaco = {
      editor: {
        getModelMarkers: jest.fn().mockReturnValue([]),
        MarkerSeverity
      }
    } as any;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should return null if editor is not initialized', async () => {
    window.editor = null as any;
    const resultPromise = checkEditorErrors();
    jest.runAllTimers();
    const result = await resultPromise;
    expect(result).toBeNull();
  });

  it('should detect errors correctly', async () => {
    (window.monaco.editor.getModelMarkers as jest.Mock).mockReturnValue([
      {
        severity: MarkerSeverity.Error,
        message: 'Test error',
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 10
      }
    ]);

    const resultPromise = checkEditorErrors();
    jest.runAllTimers();
    const result = await resultPromise;

    expect(result).toEqual({
      hasErrors: true,
      hasWarnings: false,
      errors: ['(1,1): Test error'],
      warnings: []
    });
  });

  it('should retry error checking', async () => {
    let callCount = 0;
    (window.monaco.editor.getModelMarkers as jest.Mock).mockImplementation(() => {
      callCount++;
      if (callCount === 1) {
        return [];
      }
      return [{
        severity: MarkerSeverity.Error,
        message: 'Delayed error',
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 10
      }];
    });

    const resultPromise = checkEditorErrors({ maxRetries: 2, retryDelay: 100 });
    
    // Advance timer for first retry
    jest.advanceTimersByTime(100);

    // Complete all timers
    jest.runAllTimers();
    const result = await resultPromise;

    expect(window.monaco.editor.getModelMarkers).toHaveBeenCalledTimes(2);
    expect(result?.hasErrors).toBe(true);
    expect(result?.errors).toEqual(['(1,1): Delayed error']);
  });

  it('should handle both errors and warnings', async () => {
    (window.monaco.editor.getModelMarkers as jest.Mock).mockReturnValue([
      {
        severity: MarkerSeverity.Error,
        message: 'Test error',
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: 1,
        endColumn: 10
      },
      {
        severity: MarkerSeverity.Warning,
        message: 'Test warning',
        startLineNumber: 2,
        startColumn: 3,
        endLineNumber: 2,
        endColumn: 15
      }
    ]);

    const resultPromise = checkEditorErrors();
    jest.runAllTimers();
    const result = await resultPromise;

    expect(result).toEqual({
      hasErrors: true,
      hasWarnings: true,
      errors: ['(1,1): Test error'],
      warnings: ['(2,3): Test warning']
    });
  });
}); 