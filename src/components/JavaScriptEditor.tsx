import React from 'react';
import { EditorBase } from '@components/EditorBase';
import { overrideConsoleMethods } from '@utils/console/override';
import { EditorBaseProps } from 'types/editor';
import { LANGUAGES } from '@constants/index';

export const JavaScriptEditor: React.FC = () => {
  const handleCodeExecution: EditorBaseProps['handleCodeExecution'] = (code, setOutput) => {
    overrideConsoleMethods(setOutput);
    try {
      eval(code);
    } catch (error) {
      setOutput(prev => [...prev, { type: 'error', value: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`] }]);
    }
  };

  return <EditorBase language={LANGUAGES.JAVASCRIPT} handleCodeExecution={handleCodeExecution} />;
};
