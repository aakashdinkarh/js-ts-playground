import { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { JavaScriptEditor } from '@components/JavaScriptEditor';
import { APP_CONSTANTS } from '@constants/app';

describe('JavaScriptEditor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.localStorage.clear();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  // it('renders EditorBase with JavaScript language', () => {
  //   render(<JavaScriptEditor />);
  //   const editor = screen.getByTestId('monaco-editor');
  //   expect(editor).toBeInTheDocument();
  //   expect(screen.getByTestId('mock-editor-textarea')).toHaveAttribute('data-language', LANGUAGES.JAVASCRIPT);
  // });

  it('executes JavaScript code and displays console output', async () => {
    render(<JavaScriptEditor />);
    
    const editor = screen.getByTestId('mock-editor-textarea');
    fireEvent.change(editor, {
      target: { value: 'console.log("test output")' }
    });

    const runButton = screen.getByText('Run Code');
    fireEvent.click(runButton);

    const output = screen.getByTestId('console-output-container');
    expect(output).toHaveTextContent('test output');
  });

  it('handles console.error calls', () => {
    render(<JavaScriptEditor />);
    
    const editor = screen.getByTestId('mock-editor-textarea');
    fireEvent.change(editor, {
      target: { value: 'console.error("test error")' }
    });

    // Wait for content update
    const runButton = screen.getByText('Run Code');
    fireEvent.click(runButton);

    const output = screen.getByTestId('console-output-container');
    expect(output).toHaveTextContent('test error');
  });

  it('handles syntax errors in code', () => {
    render(<JavaScriptEditor />);
    
    const editor = screen.getByTestId('mock-editor-textarea');
    fireEvent.change(editor, {
      target: { value: 'const x = ;' } // Syntax error
    });

    const runButton = screen.getByText('Run Code');
    fireEvent.click(runButton);

    const output = screen.getByTestId('console-output-container');
    expect(output).toHaveTextContent(/SyntaxError/);
  });

  it('handles runtime errors in code', () => {
    render(<JavaScriptEditor />);
    
    const editor = screen.getByTestId('mock-editor-textarea');
    fireEvent.change(editor, {
      target: { value: 'undefinedFunction()' } // Runtime error
    });

    const runButton = screen.getByText('Run Code');
    fireEvent.click(runButton);

    const output = screen.getByTestId('console-output-container');
    expect(output).toHaveTextContent(/ReferenceError/);
  });

  it('auto-runs code when enabled', () => {
    window.localStorage.setItem('autoRun', 'true');
    render(<JavaScriptEditor />);
    
    const editor = screen.getByTestId('mock-editor-textarea');
    fireEvent.change(editor, {
      target: { value: 'console.log("auto-run test")' }
    });

    // Wait for debounce
    act(() => {
      jest.advanceTimersByTime(APP_CONSTANTS.EDITOR_CONTENT_DEBOUNCE_DELAY);
    });

    const output = screen.getByTestId('console-output-container');
    expect(output).toHaveTextContent('auto-run test');
  });

  it('clears console output between runs', () => {
    render(<JavaScriptEditor />);
    
    const editor = screen.getByTestId('mock-editor-textarea');
    const runButton = screen.getByText('Run Code');

    // First run
    fireEvent.change(editor, {
      target: { value: 'console.log("first run")' }
    });
    
    // Wait for content update
    act(() => {
      jest.advanceTimersByTime(APP_CONSTANTS.EDITOR_CONTENT_DEBOUNCE_DELAY);
    });

    fireEvent.click(runButton);
    expect(screen.getByTestId('console-output-container')).toHaveTextContent('first run');

    // Second run
    fireEvent.change(editor, {
      target: { value: 'console.log("second run")' }
    });

    // Wait for content update
    act(() => {
      jest.advanceTimersByTime(APP_CONSTANTS.EDITOR_CONTENT_DEBOUNCE_DELAY);
    });

    fireEvent.click(runButton);
    
    const output = screen.getByTestId('console-output-container');
    expect(output).not.toHaveTextContent('first run');
    expect(output).toHaveTextContent('second run');
  });
}); 