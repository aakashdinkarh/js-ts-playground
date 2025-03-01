import React from 'react';
import { EditorBase } from '@components/EditorBase';
import { EditorBaseProps } from 'types/editor';
import { LANGUAGES } from '@constants/app';
import { __handleError } from '@utils/errorHandlerOverrides';
import { loadTypeScriptCompiler } from '@utils/typescript-loader';
import { checkEditorErrors } from '@utils/monaco';

export const TypeScriptEditor = () => {
  loadTypeScriptCompiler();

  const handleCodeExecution: EditorBaseProps['handleCodeExecution'] = async (code) => {
    const isCompilerReady = await loadTypeScriptCompiler();

    if (!isCompilerReady) {
      console.error('TypeScript compiler could not be loaded');
      return;
    }

    try {
      // Check for editor errors with retries
      const errorCheck = await checkEditorErrors({ maxRetries: 2, retryDelay: 1000 });
      if (!errorCheck) return;

      if (errorCheck.hasErrors) {
        console.error('TypeScript compilation errors:', ...errorCheck.errors);
        return;
      }

      if (errorCheck.hasWarnings) {
        console.warn('TypeScript compilation warnings:', ...errorCheck.warnings);
      }

      // Only transpile and run if no errors
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
