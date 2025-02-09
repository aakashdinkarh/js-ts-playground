import { render, screen, fireEvent } from '@testing-library/react';
import { Tab } from '@common/Tab';

describe('Tab', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders tab with correct label', () => {
    render(<Tab label="Test Tab" isActive={false} onClick={mockOnClick} />);
    expect(screen.getByRole('button')).toHaveTextContent('Test Tab');
  });

  it('applies active class when isActive is true', () => {
    render(<Tab label="Test Tab" isActive={true} onClick={mockOnClick} />);
    expect(screen.getByRole('button')).toHaveClass('tab-btn', 'active');
  });

  it('does not apply active class when isActive is false', () => {
    render(<Tab label="Test Tab" isActive={false} onClick={mockOnClick} />);
    expect(screen.getByRole('button')).toHaveClass('tab-btn');
    expect(screen.getByRole('button')).not.toHaveClass('active');
  });

  it('calls onClick handler when clicked', () => {
    render(<Tab label="Test Tab" isActive={false} onClick={mockOnClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
