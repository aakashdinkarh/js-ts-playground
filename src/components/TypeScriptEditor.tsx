import React from 'react';
import { EditorBase } from '@components/EditorBase';
import { transpileTypeScript } from '@utils/typescript-transpiler';
import { overrideConsoleMethods } from '@utils/console/override';
import { EditorBaseProps } from 'types/editor';
import { LANGUAGES } from '@constants/app';
import { createWrappedCode, handleEvalError } from '@utils/error-handler';

export const TypeScriptEditor: React.FC = () => {
  const handleCodeExecution: EditorBaseProps['handleCodeExecution'] = (code, setOutput) => {
    overrideConsoleMethods(setOutput);
    try {
      const jsCode = transpileTypeScript(code);
      const wrappedCode = createWrappedCode(jsCode);
      eval(wrappedCode);
    } catch (error) {
      handleEvalError(error, setOutput);
    }
  };

  return <EditorBase language={LANGUAGES.TYPESCRIPT} handleCodeExecution={handleCodeExecution} />;
};
