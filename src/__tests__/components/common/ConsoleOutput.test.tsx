import { render, screen } from '@testing-library/react';
import { ConsoleOutput } from '@common/ConsoleOutput';

describe('ConsoleOutput', () => {
  it('renders console messages', () => {
    render(
      <>
        <ConsoleOutput 
          value="Test message" 
          type="log" 
        />
        <ConsoleOutput 
          value="Error message" 
          type="error" 
        />
      </>
    );
    
    expect(screen.getByText('"Test message"')).toBeInTheDocument();
    expect(screen.getByText('"Error message"')).toBeInTheDocument();
  });

  it('formats different types of console messages', () => {
    const testObject = { name: 'test', value: 123 };

    render(
      <ConsoleOutput 
        value={testObject}
        type="log"
      />
    );
    
    expect(screen.getByText(/"name":/)).toBeInTheDocument();
    expect(screen.getByText(/"value":/)).toBeInTheDocument();
  });
}); 