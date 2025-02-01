import React from 'react';
import EditorBase from '@components/EditorBase';

const JavaScriptEditor: React.FC = () => {
  const handleCodeExecution = (code: string, setOutput: (value: React.SetStateAction<string[]>) => void) => {
    const originalLog = console.log;
    try {
      console.log = (...args) => {
        setOutput(prev => [...prev, args.join(' ')]);
        originalLog(...args);
      };
      eval(code);
    } catch (error) {
      setOutput(prev => [...prev, `Error: ${error instanceof Error ? error.message : 'Unknown error'}`]);
    } finally {
      console.log = originalLog;
    }
  };

  return <EditorBase language="javascript" handleCodeExecution={handleCodeExecution} />;
};

export default JavaScriptEditor; 