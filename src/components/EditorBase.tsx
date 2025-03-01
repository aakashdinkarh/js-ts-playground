import React, { useState, useCallback, useEffect, useRef } from 'react';
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
import { useWindowResize } from '@hooks/useWindowResize';
import { useSession } from '@contexts/SessionContext';

export const EditorBase = ({ language, handleCodeExecution }: EditorBaseProps) => {
  const [output, setOutput] = useState<any[]>([]);
  const { editorKey } = useWindowResize();
  const [autoRun, setAutoRun] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTO_RUN) !== 'false';
  });
  const { activeSession, updateCode } = useSession();
  const isConsoleMethodsOverridden = useRef<boolean>(false);

  const handleRunCode = useCallback((editor: monacoEditor.editor.IStandaloneCodeEditor) => {
    const code = editor.getValue();
    activeSession && updateCode(code);
    setOutput([]);
    handleCodeExecution(code);
  }, [handleCodeExecution, activeSession, updateCode]);

  const debouncedSetEditorContent = useDebounce((value: string, editor: monacoEditor.editor.IStandaloneCodeEditor) => {
    if (autoRun) {
      handleRunCode(editor);
    }
  }, APP_CONSTANTS.EDITOR_CONTENT_DEBOUNCE_DELAY);

  if (!isConsoleMethodsOverridden.current) {
    overrideConsoleMethods(setOutput);
    isConsoleMethodsOverridden.current = true;
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTO_RUN, String(autoRun));
  }, [autoRun]);

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
          key={editorKey}
          defaultLanguage={language}
          value={activeSession?.code || APP_CONSTANTS.DEFAULT_CODE}
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
