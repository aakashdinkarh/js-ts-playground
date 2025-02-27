import React, { useEffect, useRef } from 'react';
import { Button } from '@common/Button';
import { EditorControlsProps } from 'types/editorControl';
import { SHORTCUTS } from '@constants/shortcuts';

export const EditorControls: React.FC<EditorControlsProps> = ({
  onRun,
  autoRun,
  setAutoRun,
}) => {
  const controlsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controlsElement = controlsRef.current;
    if (!controlsElement) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the key combination matches (Cmd+Enter on Mac, Ctrl+Enter on Windows/Linux)
      if (event[SHORTCUTS.RUN_CODE.modifier] && event.key === SHORTCUTS.RUN_CODE.key) {
        event.preventDefault(); // Prevent default browser behavior
        onRun();
      }
    };

    controlsElement.addEventListener('keydown', handleKeyDown);
    // Make the element focusable
    controlsElement.tabIndex = 0;
    
    return () => controlsElement.removeEventListener('keydown', handleKeyDown);
  }, [onRun]);

  return (
    <div 
      ref={controlsRef} 
      className="controls"
      role="toolbar"
      aria-label="Editor controls"
    >
      <Button 
        title={`Run (${SHORTCUTS.RUN_CODE.display})`} 
        variant="icon" 
        onClick={onRun}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </Button>

      <label className="auto-run-toggle">
        <input
          type="checkbox"
          name="auto-run"
          checked={autoRun}
          onChange={(e) => setAutoRun(e.target.checked)}
        />
        Auto-run
      </label>
    </div>
  );
}; 