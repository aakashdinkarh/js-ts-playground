import React from 'react';
import { EditorBase } from '@components/EditorBase';
import { overrideConsoleMethods } from '@utils/console/override';
import { EditorBaseProps } from 'types/editor';
import { LANGUAGES } from '@constants/app';
import { createWrappedCode, handleEvalError } from '@utils/error-handler';

export const JavaScriptEditor: React.FC = () => {
  const handleCodeExecution: EditorBaseProps['handleCodeExecution'] = (code, setOutput) => {
    overrideConsoleMethods(setOutput);
    try {
      eval(createWrappedCode(code));
    } catch (error) {
      handleEvalError(error, setOutput);
    }
  };

  return <EditorBase language={LANGUAGES.JAVASCRIPT} handleCodeExecution={handleCodeExecution} />;
};
