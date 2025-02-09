import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { ConsoleOutputContainer } from '@components/ConsoleOutputContainer';
import { ConsoleMessage } from 'types/console';

jest.mock('@common/ConsoleOutput', () => ({
  ConsoleOutput: ({ value, type }: { value: any; type: string }) => (
    <div data-testid="mock-console-output" data-value={JSON.stringify(value)} data-type={type}>
      {String(value)}
    </div>
  ),
}));

describe('ConsoleOutputContainer', () => {
  it('renders empty container when no output is provided', () => {
    render(<ConsoleOutputContainer output={[]} />);
    const container = screen.getByTestId('console-output-container');
    expect(container).toBeInTheDocument();
    const output = within(container).getByRole('generic', { name: '' });
    expect(output).toBeEmptyDOMElement();
  });

  it('renders multiple console output messages', () => {
    const testOutput: ConsoleMessage[] = [
      { value: ['Test message 1'], type: 'log' },
      { value: ['Test message 2'], type: 'error' },
      { value: ['Test message 3'], type: 'warn' },
    ];

    render(<ConsoleOutputContainer output={testOutput} />);
    
    const outputs = screen.getAllByTestId('mock-console-output');
    expect(outputs).toHaveLength(3);
    
    outputs.forEach((output, index) => {
      expect(output).toHaveAttribute('data-value', JSON.stringify(testOutput[index].value));
      expect(output).toHaveAttribute('data-type', testOutput[index].type);
    });
  });

  it('renders messages with different data types', () => {
    const testOutput: ConsoleMessage[] = [
      { value: [42], type: 'log' },
      { value: [{ test: 'object' }], type: 'log' },
      { value: [[1, 2, 3]], type: 'log' },
    ];

    render(<ConsoleOutputContainer output={testOutput} />);
    
    const outputs = screen.getAllByTestId('mock-console-output');
    expect(outputs).toHaveLength(3);
    
    outputs.forEach((output, index) => {
      expect(output).toHaveAttribute('data-value', JSON.stringify(testOutput[index].value));
    });
  });

  it('maintains correct order of console messages', () => {
    const testOutput: ConsoleMessage[] = [
      { value: ['First'], type: 'log' },
      { value: ['Second'], type: 'log' },
      { value: ['Third'], type: 'log' },
    ];

    render(<ConsoleOutputContainer output={testOutput} />);
    
    const outputs = screen.getAllByTestId('mock-console-output');
    outputs.forEach((output, index) => {
      expect(output).toHaveTextContent(String(testOutput[index].value[0]));
    });
  });

  it('has correct accessibility attributes', () => {
    render(<ConsoleOutputContainer output={[]} />);
    const container = screen.getByTestId('console-output-container');
    
    expect(container).toHaveAttribute('role', 'region');
    expect(container).toHaveAttribute('aria-label', 'output');
  });
}); 
