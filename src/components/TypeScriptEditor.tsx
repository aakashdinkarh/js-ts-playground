import React from 'react';
import { EditorBase } from '@components/EditorBase';
import { EditorBaseProps } from 'types/editor';
import { LANGUAGES } from '@constants/app';
import { __handleError } from '@utils/errorHandlerOverrides';
import { loadTypeScriptCompiler } from '@utils/typescript-loader';

export const TypeScriptEditor: React.FC = () => {
  loadTypeScriptCompiler();

  const handleCodeExecution: EditorBaseProps['handleCodeExecution'] = async (code) => {
    const isCompilerReady = await loadTypeScriptCompiler();

    if (!isCompilerReady) {
      console.error('TypeScript compiler could not be loaded');
      return;
    }

    try {
      const jsCode = window.ts.transpileModule(code, {
        compilerOptions: {
          target: window.ts.ScriptTarget.ES5,
          module: window.ts.ModuleKind.None,
        }
      }).outputText;

      eval(jsCode);
    } catch (error) {
      __handleError(error);
    }
  };

  return <EditorBase language={LANGUAGES.TYPESCRIPT} handleCodeExecution={handleCodeExecution} />;
};
