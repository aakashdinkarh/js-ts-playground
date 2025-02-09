import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@common/Button';

describe('Button', () => {
  it('renders button with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /Click me/ })).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('have correct classnames', () => {
    render(<Button variant="primary" size="medium" className='custom-class'>Click me</Button>);
    expect(screen.getByRole('button')).toHaveClass('btn btn-primary btn-medium custom-class');
  });

});
