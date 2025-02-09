import { fireEvent, render, screen } from '@testing-library/react';
import { ConsoleArrayItem } from '@common/ConsoleArrayItem';
import { CONSOLE_METHODS } from '@constants/console';
import { copyToClipboard } from '@utils/clipboard';

jest.mock('@utils/clipboard', () => ({
  copyToClipboard: jest.fn().mockImplementation(() => Promise.resolve())
}));

describe('ConsoleArrayItem', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('primitive values', () => {
    it('renders string value correctly', () => {
      render(<ConsoleArrayItem val="test" idx={0} type={CONSOLE_METHODS.LOG} />);
      expect(screen.getByText('"test"')).toBeInTheDocument();
    });

    it('renders number value correctly', () => {
      render(<ConsoleArrayItem val={42} idx={0} type={CONSOLE_METHODS.LOG} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('renders boolean value correctly', () => {
      render(<ConsoleArrayItem val={true} idx={0} type={CONSOLE_METHODS.LOG} />);
      expect(screen.getByText('true')).toBeInTheDocument();
    });

    it('adds space before non-first items', () => {
      const { container } = render(<ConsoleArrayItem val="test" idx={1} type={CONSOLE_METHODS.LOG} />);
      expect(container.textContent).toBe(' "test"');
    });
  });

  describe('array values', () => {
    it('renders collapsed array with length and preview', () => {
      const array = [1, 2, 3];
      render(<ConsoleArrayItem val={array} idx={0} type={CONSOLE_METHODS.LOG} />);
      
      expect(screen.getByText(/▶/)).toBeInTheDocument();
      expect(screen.getByText(/\(3\)/)).toBeInTheDocument();
      expect(screen.getByText(/\[1, 2, 3\]/)).toBeInTheDocument();
    });

    it('expands array when clicked', () => {
      const array = [1, 2, 3];
      render(<ConsoleArrayItem val={array} idx={0} type={CONSOLE_METHODS.LOG} />);
      
      fireEvent.click(screen.getByText(/▶/));
      
      expect(screen.getByText(/▼/)).toBeInTheDocument();
      expect(screen.getByText('"0":')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('"1":')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('"2":')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('copies array to clipboard when copy button is clicked', async () => {
      const array = [1, 2, 3];
      render(<ConsoleArrayItem val={array} idx={0} type={CONSOLE_METHODS.LOG} />);
      
      fireEvent.click(screen.getByText('📋'));
      
      expect(copyToClipboard).toHaveBeenCalledWith(array);
    });

    it('prevents expansion when clicking copy button', () => {
      const array = [1, 2, 3];
      render(<ConsoleArrayItem val={array} idx={0} type={CONSOLE_METHODS.LOG} />);
      
      const copyButton = screen.getByText('📋');
      fireEvent.click(copyButton);
      
      expect(screen.queryByText('"0":')).not.toBeInTheDocument();
    });
  });

  describe('object values', () => {
    it('renders non-array objects using ConsoleOutput', () => {
      const obj = { name: 'test', value: 123 };
      render(<ConsoleArrayItem val={obj} idx={0} type={CONSOLE_METHODS.LOG} />);
      
      expect(screen.getByText(/Object/)).toBeInTheDocument();
      expect(screen.getByTestId('expandable')).toBeInTheDocument();
    });

    it('renders null value correctly', () => {
      render(<ConsoleArrayItem val={null} idx={0} type={CONSOLE_METHODS.LOG} />);
      expect(screen.getByText('null')).toBeInTheDocument();
    });
  });

  describe('nested arrays', () => {
    it('renders nested arrays with proper formatting', () => {
      const nestedArray = [[1, 2], [3, 4]];
      render(<ConsoleArrayItem val={nestedArray} idx={0} type={CONSOLE_METHODS.LOG} />);
      
      expect(screen.getByText(/▶/)).toBeInTheDocument();
      expect(screen.getByText(/\(2\)/)).toBeInTheDocument();
      expect(screen.getByText(/\[\[1, 2\], \[3, 4\]\]/)).toBeInTheDocument();
      
      // Expand first level
      fireEvent.click(screen.getByText(/▶/));
      
      expect(screen.getAllByText(/▶/).length).toBe(2); // Two collapsed nested arrays
      expect(screen.getAllByText(/\(2\)/)).toHaveLength(3);
    });
  });
});