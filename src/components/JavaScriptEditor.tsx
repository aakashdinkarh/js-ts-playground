import React from 'react';
import { EditorBase } from '@components/EditorBase';
import { overrideConsoleMethods } from '@utils/console/override';

export const JavaScriptEditor: React.FC = () => {
  const handleCodeExecution = (code: string, setOutput: (value: React.SetStateAction<any[]>) => void) => {
    overrideConsoleMethods(setOutput);
    try {
      eval(code);
    } catch (error) {
      setOutput(prev => [...prev, { type: 'error', value: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`] }]);
    }
  };

  return <EditorBase language="javascript" handleCodeExecution={handleCodeExecution} />;
};
