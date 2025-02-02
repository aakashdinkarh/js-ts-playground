import React from 'react';
import { EditorBase } from '@components/EditorBase';
import { transpileTypeScript } from '@utils/typescript-transpiler';
import { overrideConsoleMethods } from '@utils/console/override';

export const TypeScriptEditor: React.FC = () => {
  const handleCodeExecution = (code: string, setOutput: (value: React.SetStateAction<any[]>) => void) => {
    overrideConsoleMethods(setOutput);
    try {
      const jsCode = transpileTypeScript(code);
      const wrappedCode = `
        try {
          ${jsCode}
        } catch (error) {
          console.error(error);
        }
      `;
      const func = new Function('console', wrappedCode);
      func(console);
    } catch (error) {
      setOutput(prev => [...prev, { 
        type: 'error', 
        value: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`] 
      }]);
    }
  };

  return <EditorBase language="typescript" handleCodeExecution={handleCodeExecution} />;
};
