declare namespace Monaco {
  interface IMarker {
    severity: number;
    message: string;
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  }

  interface Editor {
    getModel: () => {
      uri: any;
    };
    getValue: () => string;
  }

  interface MonacoEditor {
    getModelMarkers: (filter: { resource: any }) => IMarker[];
    MarkerSeverity: {
      Error: number;
      Warning: number;
      Info: number;
      Hint: number;
    };
  }
}

declare global {
  interface Window {
    monaco: {
      editor: Monaco.MonacoEditor;
    };
    editor: Monaco.Editor;
  }
}

export {}; 