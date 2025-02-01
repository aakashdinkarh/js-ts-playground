import React from 'react';
import EditorBase from '@components/EditorBase';

const TypeScriptEditor: React.FC = () => {
  const handleCodeExecution = (code: string, setOutput: (value: React.SetStateAction<any[]>) => void) => {
    const originalLog = console.log;
    try {
      console.log = (...args) => {
        setOutput(prev => [...prev, ...args]);
        originalLog(...args);
      };
      
      // TypeScript transformation
      const jsCode = code
        .replace(/interface\s+\w+\s*{[^}]*}/g, '')
        .replace(/type\s+\w+\s*=\s*['"]?\w+['"]?\s*;/g, '')
        .replace(/:\s*(?:\w+|{[^}]*})(?:\[\])?(?=\s*=)/g, '')
        .replace(/(\w+)\s*:\s*([^,}\n]*)/g, '$1: $2')
        .trim();
      
      eval(jsCode);
    } catch (error) {
      setOutput(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      console.log = originalLog;
    }
  };

  return <EditorBase language="typescript" handleCodeExecution={handleCodeExecution} />;
};

export default TypeScriptEditor; 