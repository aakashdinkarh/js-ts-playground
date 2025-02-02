import { useEffect, useRef } from 'react';
import { APP_CONSTANTS } from '@constants/index';

interface AutoRunResult {
  editorContentChanged: React.RefObject<boolean>;
}

export const useAutoRun = (
  autoRun: boolean,
  editorContent: string,
  handleRunCode: (editor: any) => void
): AutoRunResult => {
  const autoRunTimerRef = useRef<NodeJS.Timeout | null>(null);
  const editorContentChanged = useRef(false);

  useEffect(() => {
    if (!autoRun || !editorContentChanged.current) return;

    autoRunTimerRef.current = setTimeout(() => {
      handleRunCode((window as any).editor);
    }, APP_CONSTANTS.AUTO_RUN_DELAY);

    return () => {
      if (autoRunTimerRef.current) {
        clearTimeout(autoRunTimerRef.current);
      }
    };
  }, [handleRunCode, autoRun, editorContent]);

  return { editorContentChanged };
}; 