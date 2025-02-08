import React, { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { EditorControls } from '@components/EditorControls';
import { ConsoleOutputContainer } from '@components/ConsoleOutputContainer';
import { STORAGE_KEYS } from '@constants/storage';
import { APP_CONSTANTS } from '@constants/app';
import '@styles/components.css';
import { useDebounce } from '@hooks/useDebounce';
import { EditorBaseProps } from 'types/editor';
import { overrideConsoleMethods } from '@utils/console/override';

export const EditorBase: React.FC<EditorBaseProps> = ({ language, handleCodeExecution }) => {
  const [output, setOutput] = useState<any[]>([]);
  const [autoRun, setAutoRun] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTO_RUN) !== 'false';
  });
  const [editorContent, setEditorContent] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.EDITOR_CONTENT(language)) || APP_CONSTANTS.DEFAULT_CODE;
  });

  const handleRunCode = useCallback((editor: any) => {
    const code = editor.getValue();
    setEditorContent(code);
    setOutput([]);
    handleCodeExecution(code);
  }, [handleCodeExecution]);

  const debouncedSetEditorContent = useDebounce((value: string, editor: any) => {
    setEditorContent(value);
    if (autoRun) {
      handleRunCode(editor);
    }
  }, APP_CONSTANTS.EDITOR_CONTENT_DEBOUNCE_DELAY);

  overrideConsoleMethods(setOutput);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTO_RUN, String(autoRun));
  }, [autoRun]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDITOR_CONTENT(language), editorContent);
  }, [editorContent, language]);

  return (
    <>
      <div className="editor-container">
        <Editor
          defaultLanguage={language}
          value={editorContent}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onChange={(value) => {
            debouncedSetEditorContent(value || '', (window as any).editor);
          }}
          onMount={(editor) => {
            (window as any).editor = editor;
            handleRunCode(editor);
          }}
        />
      </div>
      <EditorControls
        onRun={() => handleRunCode((window as any).editor)}
        onClear={() => setOutput([])}
        autoRun={autoRun}
        setAutoRun={setAutoRun}
      />
      <ConsoleOutputContainer output={output} />
    </>
  );
};