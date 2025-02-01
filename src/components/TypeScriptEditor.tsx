import React from 'react';
import EditorBase from '@components/EditorBase';
import { transpileTypeScript } from '@utils/typescript-transpiler';

const TypeScriptEditor: React.FC = () => {
  const handleCodeExecution = (code: string, setOutput: (value: React.SetStateAction<any[]>) => void) => {
    const originalLog = console.log;
    try {
      console.log = (...args) => {
        setOutput(prev => [...prev, ...args]);
        originalLog(...args);
      };
      
      const jsCode = transpileTypeScript(code);
      const func = new Function('console', jsCode);
      func(console);
    } catch (error) {
      setOutput(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      console.log = originalLog;
    }
  };

  return <EditorBase language="typescript" handleCodeExecution={handleCodeExecution} />;
};

export default TypeScriptEditor; 