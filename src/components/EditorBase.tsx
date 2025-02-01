import React, { useState, useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import EditorControls from './EditorControls';
import ConsoleOutputContainer from './ConsoleOutputContainer';
import { APP_CONSTANTS, STORAGE_KEYS } from '@constants/index';
import '@styles/components.css';

interface EditorBaseProps {
  language: string;
  handleCodeExecution: (code: string, setOutput: React.Dispatch<React.SetStateAction<string[]>>) => void;
}

const EditorBase: React.FC<EditorBaseProps> = ({ language, handleCodeExecution }) => {
  const [output, setOutput] = useState<any[]>([]);
  const [lastEdit, setLastEdit] = useState<number>(0);
  const [autoRun, setAutoRun] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTO_RUN) !== 'false';
  });
  const [editorContent, setEditorContent] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.EDITOR_CONTENT(language)) || APP_CONSTANTS.DEFAULT_CODE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTO_RUN, String(autoRun));
  }, [autoRun]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EDITOR_CONTENT(language), editorContent);
  }, [editorContent, language]);

  const handleRunCode = useCallback((editor: any) => {
    const code = editor.getValue();
    setEditorContent(code);
    setOutput([]);
    handleCodeExecution(code, setOutput);
  }, [handleCodeExecution]);

  useEffect(() => {
    if (!lastEdit || !autoRun) return;

    const timer = setTimeout(() => {
      handleRunCode((window as any).editor);
    }, APP_CONSTANTS.AUTO_RUN_DELAY);

    return () => clearTimeout(timer);
  }, [lastEdit, handleRunCode, autoRun]);

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
            setEditorContent(value || '');
            setLastEdit(Date.now());
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

export default EditorBase; 