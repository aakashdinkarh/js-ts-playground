import { MarkerSeverity } from '@constants/monaco';

interface ErrorCheckResult {
  hasErrors: boolean;
  hasWarnings: boolean;
  errors: string[];
  warnings: string[];
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const checkEditorErrors = async (
  options: { maxRetries?: number; retryDelay?: number } = {}
): Promise<ErrorCheckResult | null> => {
  if (!window.editor) {
    console.error('Editor not initialized');
    return null;
  }

  const { maxRetries = 3, retryDelay = 100 } = options;
  const model = window.editor.getModel();
  const severityLevels = window.monaco?.editor?.MarkerSeverity || MarkerSeverity;

  // Try multiple times to get markers
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const markers = window.monaco.editor.getModelMarkers({ resource: model.uri });
    
    // If we have any markers, or this is our last attempt, process them
    if (markers.length > 0 || attempt === maxRetries - 1) {
      // Check for errors and warnings
      const errors = markers.filter(marker => marker.severity === severityLevels.Error);
      const warnings = markers.filter(marker => marker.severity === severityLevels.Warning);

      const errorMessages = errors.map(error => `(${error.startLineNumber},${error.startColumn}): ${error.message}`);
      const warningMessages = warnings.map(warning => `(${warning.startLineNumber},${warning.startColumn}): ${warning.message}`);

      return {
        hasErrors: errors.length > 0,
        hasWarnings: warnings.length > 0,
        errors: errorMessages,
        warnings: warningMessages
      };
    }

    // Wait before next attempt
    await wait(retryDelay);
  }

  // If we get here, we found no markers after all retries
  return {
    hasErrors: false,
    hasWarnings: false,
    errors: [],
    warnings: []
  };
}; 