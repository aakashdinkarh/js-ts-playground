import React, { useState, useCallback, useEffect } from 'react';
import Editor, { Monaco } from '@monaco-editor/react';
import * as monacoEditor from 'monaco-editor';
import { EditorControls } from '@components/EditorControls';
import { ConsoleOutputContainer } from '@components/ConsoleOutputContainer';
import { STORAGE_KEYS } from '@constants/storage';
import { APP_CONSTANTS } from '@constants/app';
import { useDebounce } from '@hooks/useDebounce';
import { EditorBaseProps } from 'types/editor';
import { overrideConsoleMethods } from '@utils/console/override';
import { SHORTCUTS } from '@constants/shortcuts';

export const EditorBase: React.FC<EditorBaseProps> = ({ language, handleCodeExecution }) => {
  const [output, setOutput] = useState<any[]>([]);
  const [autoRun, setAutoRun] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTO_RUN) !== 'false';
  });
  const [editorContent, setEditorContent] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.EDITOR_CONTENT(language)) || APP_CONSTANTS.DEFAULT_CODE;
  });

  const handleRunCode = useCallback((editor: monacoEditor.editor.IStandaloneCodeEditor) => {
    const code = editor.getValue();
    setEditorContent(code);
    setOutput([]);
    handleCodeExecution(code);
  }, [handleCodeExecution]);

  const debouncedSetEditorContent = useDebounce((value: string, editor: monacoEditor.editor.IStandaloneCodeEditor) => {
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

  const handleEditorMount = (editor: monacoEditor.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    (window as any).editor = editor;

    // Add command for running code
    editor.addCommand(
      // For Mac: Cmd+Enter, For Windows: Ctrl+Enter
      (SHORTCUTS.RUN_CODE.modifier === 'metaKey' ? monaco.KeyMod.CtrlCmd : monaco.KeyMod.WinCtrl) | monaco.KeyCode.Enter,
      () => handleRunCode(editor)
    );

    handleRunCode(editor);
  };

  return (
    <div className="editor-output-container">
      <div className="editor-container">
        <EditorControls
          onRun={() => handleRunCode((window as any).editor)}
          autoRun={autoRun}
          setAutoRun={setAutoRun}
        />
        <hr />
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
          onMount={handleEditorMount}
        />
      </div>
      <ConsoleOutputContainer output={output} setOutput={setOutput} />
    </div>
  );
};