import React, { useState, useCallback, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { EditorControls } from '@components/EditorControls';
import { ConsoleOutputContainer } from '@components/ConsoleOutputContainer';
import { APP_CONSTANTS, STORAGE_KEYS } from '@constants/index';
import '@styles/components.css';
import { useDebounce } from '@hooks/useDebounce';
import { EditorBaseProps } from 'types/editor';

export const EditorBase: React.FC<EditorBaseProps> = ({ language, handleCodeExecution }) => {
  const [output, setOutput] = useState<any[]>([]);
  const [autoRun, setAutoRun] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTO_RUN) !== 'false';
  });
  const [editorContent, setEditorContent] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.EDITOR_CONTENT(language)) || APP_CONSTANTS.DEFAULT_CODE;
  });
  const editorContentChanged = useRef(false);
  const autoRunTimerRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSetEditorContent = useDebounce((value: string) => {
    setEditorContent(value);
  }, APP_CONSTANTS.EDITOR_CONTENT_DEBOUNCE_DELAY);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTO_RUN, String(autoRun));
  }, [autoRun]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDITOR_CONTENT(language), editorContent);
  }, [editorContent, language]);

  const clearAutoRunTimer = useCallback((timerRef: React.RefObject<NodeJS.Timeout | null>) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const handleRunCode = useCallback((editor: any) => {
    editorContentChanged.current = false;
    clearAutoRunTimer(autoRunTimerRef);
    const code = editor.getValue();
    setEditorContent(code);
    setOutput([]);
    handleCodeExecution(code, setOutput);
  }, [handleCodeExecution, autoRunTimerRef, clearAutoRunTimer]);

  useEffect(() => {
    if (!autoRun || !editorContentChanged.current) return;

    autoRunTimerRef.current = setTimeout(() => {
      handleRunCode((window as any).editor);
    }, APP_CONSTANTS.AUTO_RUN_DELAY);

    return () => {
      clearAutoRunTimer(autoRunTimerRef);
    };
  }, [handleRunCode, autoRun, editorContentChanged, editorContent, clearAutoRunTimer]);

  return (
    <>
      <div className="editor-container">
        <Editor
          height="70vh"
          defaultLanguage={language}
          value={editorContent}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
          onChange={(value) => {
            debouncedSetEditorContent(value || '');
            editorContentChanged.current = true;
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