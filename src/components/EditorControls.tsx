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
      <Button variant="primary" onClick={onRun}>
        Run Code
      </Button>
      <Button variant="danger" onClick={onClear}>
        Clear Console
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