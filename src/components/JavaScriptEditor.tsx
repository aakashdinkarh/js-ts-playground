import React from 'react';
import { EditorBase } from '@components/EditorBase';
import type { EditorBaseProps } from 'types/editor';
import { LANGUAGES } from '@constants/app';
import { __handleError } from '@utils/errorHandlerOverrides';

export const JavaScriptEditor = () => {
  const handleCodeExecution: EditorBaseProps['handleCodeExecution'] = async (code) => {
    try {
      eval(code);
    } catch (error) {
      __handleError(error);
    }
  };

  return <EditorBase language={LANGUAGES.JAVASCRIPT} handleCodeExecution={handleCodeExecution} />;
};
