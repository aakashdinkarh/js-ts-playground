import React from 'react';
import EditorBase from '@components/EditorBase';
import { transpileTypeScript } from '@utils/typescript-transpiler';
import { overrideConsoleMethods } from '@utils/console-overrides';

const TypeScriptEditor: React.FC = () => {
  const handleCodeExecution = (code: string, setOutput: (value: React.SetStateAction<any[]>) => void) => {
    const restoreConsole = overrideConsoleMethods(setOutput);
    try {
      const jsCode = transpileTypeScript(code);
      const func = new Function('console', jsCode);
      func(console);
    } catch (error) {
      setOutput(prev => [...prev, { type: 'error', value: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`] }]);
    } finally {
      restoreConsole();
    }
  };

  return <EditorBase language="typescript" handleCodeExecution={handleCodeExecution} />;
};

export default TypeScriptEditor; 