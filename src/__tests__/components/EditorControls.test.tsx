import { render, screen, fireEvent } from '@testing-library/react';
import { EditorControls } from '@components/EditorControls';

describe('EditorControls', () => {
  const mockOnRun = jest.fn();
  const mockOnClear = jest.fn();
  const mockSetAutoRun = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders run and clear buttons', () => {
    render(
      <EditorControls 
        onRun={mockOnRun}
        onClear={mockOnClear}
        autoRun={false}
        setAutoRun={mockSetAutoRun}
      />
    );

    expect(screen.getByRole('button', { name: /Run Code/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Clear Console/ })).toBeInTheDocument();
  });

  it('calls appropriate handlers when buttons are clicked', () => {
    render(
      <EditorControls 
        onRun={mockOnRun}
        onClear={mockOnClear}
        autoRun={false}
        setAutoRun={mockSetAutoRun}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Run Code/ }));
    expect(mockOnRun).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: /Clear Console/ }));
    expect(mockOnClear).toHaveBeenCalledTimes(1);
  });

  it('renders auto-run checkbox with correct initial state', () => {
    render(
      <EditorControls 
        onRun={mockOnRun}
        onClear={mockOnClear}
        autoRun={true}
        setAutoRun={mockSetAutoRun}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /Auto-run/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it('calls setAutoRun when checkbox is toggled', () => {
    const { rerender } = render(
      <EditorControls 
        onRun={mockOnRun}
        onClear={mockOnClear}
        autoRun={true}
        setAutoRun={mockSetAutoRun}
      />
    );

    const checkbox = screen.getByRole('checkbox', { name: /Auto-run/i });
    expect(checkbox).toBeChecked();
    
    fireEvent.click(checkbox);
    expect(mockSetAutoRun).toHaveBeenCalledWith(false);

    // Rerender with updated autoRun value
    rerender(
      <EditorControls 
        onRun={mockOnRun}
        onClear={mockOnClear}
        autoRun={false}
        setAutoRun={mockSetAutoRun}
      />
    );

    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(mockSetAutoRun).toHaveBeenCalledWith(true);
  });

  it('renders auto-run label correctly', () => {
    render(
      <EditorControls 
        onRun={mockOnRun}
        onClear={mockOnClear}
        autoRun={false}
        setAutoRun={mockSetAutoRun}
      />
    );

    expect(screen.getByLabelText(/Auto-run/i)).toBeInTheDocument();
  });

  it('applies correct button variants', () => {
    render(
      <EditorControls 
        onRun={mockOnRun}
        onClear={mockOnClear}
        autoRun={false}
        setAutoRun={mockSetAutoRun}
      />
    );

    const runButton = screen.getByRole('button', { name: /Run Code/ });
    const clearButton = screen.getByRole('button', { name: /Clear Console/ });

    expect(runButton).toHaveClass(/primary/);
    expect(clearButton).toHaveClass(/danger/);
  });
}); 
