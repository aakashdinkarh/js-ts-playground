import React from 'react';
import EditorBase from '@components/EditorBase';
import { overrideConsoleMethods } from '@utils/console-overrides';

const JavaScriptEditor: React.FC = () => {
  const handleCodeExecution = (code: string, setOutput: (value: React.SetStateAction<any[]>) => void) => {
    const restoreConsole = overrideConsoleMethods(setOutput);
    try {
      eval(code);
    } catch (error) {
      setOutput(prev => [...prev, { type: 'error', value: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`] }]);
    } finally {
      restoreConsole();
    }
  };

  return <EditorBase language="javascript" handleCodeExecution={handleCodeExecution} />;
};

export default JavaScriptEditor; 