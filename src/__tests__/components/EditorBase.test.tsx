import { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditorBase } from '@components/EditorBase';
import { STORAGE_KEYS } from '@constants/storage';
import { APP_CONSTANTS } from '@constants/app';

describe('EditorBase', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    window.localStorage.clear();
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders editor with initial value', () => {
    const initialValue = APP_CONSTANTS.DEFAULT_CODE;
    render(<EditorBase language="javascript" handleCodeExecution={() => Promise.resolve()} />);
    
    expect(screen.getByTestId('monaco-editor')).toBeInTheDocument();
    expect(screen.getByTestId('mock-editor-textarea')).toHaveValue(initialValue);
  });

  it('loads saved content from localStorage', () => {
    const savedContent = 'console.log("saved content")';
    window.localStorage.setItem(STORAGE_KEYS.EDITOR_CONTENT('javascript'), savedContent);
    
    render(<EditorBase language="javascript" handleCodeExecution={() => Promise.resolve()} />);
    expect(screen.getByTestId('mock-editor-textarea')).toHaveValue(savedContent);
    expect(window.localStorage.getItem).toHaveBeenCalledWith(STORAGE_KEYS.EDITOR_CONTENT('javascript'));
  });

  it('auto-runs code when autoRun is enabled', () => {
    const handleCodeExecution = jest.fn();
    window.localStorage.setItem(STORAGE_KEYS.AUTO_RUN, 'true');
    
    render(<EditorBase language="javascript" handleCodeExecution={handleCodeExecution} />);
    
    // Should run on mount
    expect(handleCodeExecution).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByTestId('mock-editor-textarea'), {
      target: { value: 'console.log("test")' }
    });

    // Run debounce delay
    act(() => {
      jest.advanceTimersByTime(APP_CONSTANTS.EDITOR_CONTENT_DEBOUNCE_DELAY);
    });

    // Should run again after content change when autoRun is true
    expect(handleCodeExecution).toHaveBeenCalledTimes(2);
  });

  it('does not auto-run on content change when disabled', () => {
    const handleCodeExecution = jest.fn();
    window.localStorage.setItem(STORAGE_KEYS.AUTO_RUN, 'false');
    
    render(<EditorBase language="javascript" handleCodeExecution={handleCodeExecution} />);
    
    // Should still run on mount
    expect(handleCodeExecution).toHaveBeenCalledTimes(1);

    fireEvent.change(screen.getByTestId('mock-editor-textarea'), {
      target: { value: 'console.log("test")' }
    });

    // Run debounce delay
    act(() => {
      jest.advanceTimersByTime(APP_CONSTANTS.EDITOR_CONTENT_DEBOUNCE_DELAY);
    });

    // Should not run again after content change when autoRun is false
    expect(handleCodeExecution).toHaveBeenCalledTimes(1);
  });

  it('clears output before running new code', () => {
    const handleCodeExecution = jest.fn();
    render(<EditorBase language="javascript" handleCodeExecution={handleCodeExecution} />);
    
    const runButton = screen.getByText('Run Code');
    fireEvent.click(runButton);

    const consoleOutput = screen.getByTestId('console-output-container');
    expect(consoleOutput).toBeInTheDocument();
    expect(consoleOutput).toHaveTextContent('');
    expect(handleCodeExecution).toHaveBeenCalled();
  });

  it('renders console output container empty', () => {
    render(<EditorBase language="javascript" handleCodeExecution={() => Promise.resolve()} />);
    
    const consoleOutputContainer = screen.getByTestId('console-output-container');
    expect(consoleOutputContainer).toBeInTheDocument();
    expect(consoleOutputContainer).toHaveTextContent('');
  });

  it('calls handleCodeExecution when Run Code button is clicked', () => {
    const handleCodeExecution = jest.fn();
    render(<EditorBase language="javascript" handleCodeExecution={handleCodeExecution} />);
    
    const runButton = screen.getByText('Run Code');
    fireEvent.click(runButton);

    expect(handleCodeExecution).toHaveBeenCalled();
  });

  // We should also add a test for AUTO_RUN toggle
  it('persists autoRun setting to localStorage', () => {
    render(<EditorBase language="javascript" handleCodeExecution={() => Promise.resolve()} />);
    
    // Find and click the auto-run checkbox
    const autoRunCheckbox = screen.getByLabelText(/Auto-run/i);
    fireEvent.click(autoRunCheckbox);

    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.AUTO_RUN,
      'false'
    );

    // Toggle back
    fireEvent.click(autoRunCheckbox);
    expect(window.localStorage.setItem).toHaveBeenCalledWith(
      STORAGE_KEYS.AUTO_RUN,
      'true'
    );
  });
}); 
