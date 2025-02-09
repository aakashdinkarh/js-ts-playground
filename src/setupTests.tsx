import React, { useEffect, useRef } from 'react';
import '@testing-library/jest-dom';
import { MarkerSeverity } from '@constants/monaco';

// Mock ResizeObserver which is not available in jsdom
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock markers array that can be manipulated in tests
export const mockMarkers: any[] = [];

// Mock editor instance
export const mockEditor = {
  getValue: jest.fn(),
  getModel: jest.fn().mockReturnValue({ uri: 'test-uri' })
};

// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
};

// Setup global mocks
beforeAll(() => {
  // Mock console methods to prevent infinite recursion
  console.log = jest.fn();
  console.error = jest.fn();
  console.warn = jest.fn();
  console.info = jest.fn();
  console.debug = jest.fn();

  // Mock Clipboard API
  Object.defineProperty(window.navigator, 'clipboard', {
    value: {
      writeText: jest.fn(() => Promise.resolve()),
      readText: jest.fn(() => Promise.resolve('')),
    },
    configurable: true
  });

  // Mock Monaco global
  window.monaco = {
    editor: {
      getModelMarkers: jest.fn().mockReturnValue(mockMarkers),
      MarkerSeverity
    }
  } as any;

  // Mock editor global
  window.editor = mockEditor as any;

  // Mock TypeScript compiler
  window.ts = {
    transpileModule: jest.fn().mockReturnValue({ outputText: '' }),
    ScriptTarget: { ES5: 1 },
    ModuleKind: { None: 0 }
  } as any;
});

// Restore original console methods after all tests
afterAll(() => {
  console.log = originalConsole.log;
  console.error = originalConsole.error;
  console.warn = originalConsole.warn;
  console.info = originalConsole.info;
  console.debug = originalConsole.debug;
});

// Create a mock Editor component
const MockEditor = ({ defaultLanguage, onMount, onChange, value }: any) => {
  const editorValue = useRef(value);
  // Create editor instance with all required methods
  const editorInstance = {
    getValue: () => editorValue.current,
  };

  useEffect(() => {
    (window as any).editor = editorInstance;
    if (onMount) {
      onMount(editorInstance);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    editorValue.current = e.target.value;
    onChange?.(e.target.value);
  };

  return (
    <div data-testid="monaco-editor">
      <textarea
        data-testid="mock-editor-textarea"
        value={editorValue.current}
        onChange={handleChange}
        data-language={defaultLanguage}
      />
    </div>
  );
};

// Mock Monaco Editor with named exports
jest.mock('@monaco-editor/react', () => ({
  __esModule: true,
  default: MockEditor
}));

// Create localStorage mock
const createLocalStorageMock = () => {
  let store: { [key: string]: string } = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};

// Declare type for window.localStorage
declare global {
  interface Window {
    localStorage: {
      getItem: jest.Mock;
      setItem: jest.Mock;
      clear: jest.Mock;
    };
  }
}

// Setup localStorage mock before each test
beforeEach(() => {
  const localStorageMock = createLocalStorageMock();
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  mockMarkers.length = 0;
  jest.clearAllMocks();
});