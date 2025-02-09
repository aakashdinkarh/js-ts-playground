import React from 'react';
import { Button } from '@common/Button';
import { EditorControlsProps } from 'types/editorControl';

export const EditorControls: React.FC<EditorControlsProps> = ({
  onRun,
  onClear,
  autoRun,
  setAutoRun,
}) => {
  return (
    <div className="controls">
      <Button variant="icon" onClick={onRun}>
        <svg width={20} height={20} viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      </Button>

      <label className="auto-run-toggle">
        <input
          type="checkbox"
          checked={autoRun}
          onChange={(e) => setAutoRun(e.target.checked)}
        />
        Auto-run
      </label>
    </div>
  );
}; 