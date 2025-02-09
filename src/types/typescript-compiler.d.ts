declare global {
  interface Window {
    ts: {
      transpileModule: (
        input: string,
        options: {
          compilerOptions: {
            target: number;
            module: number;
          };
        }
      ) => { outputText: string };
      ScriptTarget: {
        ES5: number;
      };
      ModuleKind: {
        None: number;
      };
    };
  }
}

export {}; 