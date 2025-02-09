import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { LANGUAGES } from '@constants/app';
import { STORAGE_KEYS } from '@constants/storage';

// Mock the Tab component
jest.mock('@components/common/Tab', () => ({
  Tab: ({ label, isActive, onClick }: any) => (
    <button
      role="tab"
      aria-selected={isActive}
      className={isActive ? 'active' : ''}
      onClick={onClick}
    >
      {label}
    </button>
  )
}));

// Mock the editor components
jest.mock('@components/JavaScriptEditor', () => ({
  JavaScriptEditor: () => (
    <div data-testid="javascript-editor" role="textbox">
      JavaScript Editor
    </div>
  )
}));

jest.mock('@components/TypeScriptEditor', () => ({
  TypeScriptEditor: () => (
    <div data-testid="typescript-editor" role="textbox">
      TypeScript Editor
    </div>
  )
}));

describe('App', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('renders the header with title and GitHub link', () => {
    render(<App />);
    
    // Check if title is present
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    
    // Check if GitHub link is present and has correct attributes
    const githubLink = screen.getByText('GitHub');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('defaults to TypeScript when no language is stored', () => {
    render(<App />);
    
    // Check if TypeScript tab is active
    const tsTab = screen.getByRole('tab', { name: 'TypeScript' });
    expect(tsTab).toHaveClass('active');
    
    // Check if TypeScript editor is rendered
    expect(screen.getByTestId('typescript-editor')).toBeInTheDocument();
  });

  it('switches between JavaScript and TypeScript editors', () => {
    render(<App />);
    
    // Initially TypeScript should be active
    expect(screen.getByTestId('typescript-editor')).toBeInTheDocument();
    
    // Switch to JavaScript
    fireEvent.click(screen.getByRole('tab', { name: 'JavaScript' }));
    expect(screen.getByTestId('javascript-editor')).toBeInTheDocument();
    
    // Switch back to TypeScript
    fireEvent.click(screen.getByRole('tab', { name: 'TypeScript' }));
    expect(screen.getByTestId('typescript-editor')).toBeInTheDocument();
  });

  it('persists language selection in localStorage', () => {
    render(<App />);
    
    // Switch to JavaScript
    fireEvent.click(screen.getByRole('tab', { name: 'JavaScript' }));
    expect(localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE)).toBe(LANGUAGES.JAVASCRIPT);
    
    // Switch to TypeScript
    fireEvent.click(screen.getByRole('tab', { name: 'TypeScript' }));
    expect(localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE)).toBe(LANGUAGES.TYPESCRIPT);
  });

  it('loads the previously selected language from localStorage', () => {
    // Set initial language preference
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, LANGUAGES.JAVASCRIPT);
    
    render(<App />);
    
    // JavaScript editor should be rendered
    expect(screen.getByTestId('javascript-editor')).toBeInTheDocument();
    
    // JavaScript tab should be active
    const jsTab = screen.getByRole('tab', { name: 'JavaScript' });
    expect(jsTab).toHaveClass('active');
  });
}); 