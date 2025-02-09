import { render, screen, within } from '@testing-library/react';
import { ConsoleTable } from '@common/ConsoleTable';

describe('ConsoleTable', () => {
  describe('array of objects', () => {
    it('renders table with headers and data from array of objects', () => {
      const data = [
        { name: 'John', age: 30, city: 'New York' },
        { name: 'Jane', age: 25, city: 'London' }
      ];

      render(<ConsoleTable value={data} />);

      const cells = screen.getAllByRole('cell');
      
      // Check headers are present
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('(index)');
      expect(headers[1]).toHaveTextContent('name');
      expect(headers[2]).toHaveTextContent('age');
      expect(headers[3]).toHaveTextContent('city');

      // Check data in specific cells
      expect(cells[0]).toHaveTextContent('0');
      expect(cells[1]).toHaveTextContent('"John"');
      expect(cells[2]).toHaveTextContent('30');
      expect(cells[3]).toHaveTextContent('"New York"');
      expect(cells[4]).toHaveTextContent('1');
      expect(cells[5]).toHaveTextContent('"Jane"');
      expect(cells[6]).toHaveTextContent('25');
      expect(cells[7]).toHaveTextContent('"London"');
    });

    it('handles objects with different properties', () => {
      const data = [
        { name: 'John', age: 30 },
        { name: 'Jane', city: 'London' }
      ];

      render(<ConsoleTable value={data} />);

      const cells = screen.getAllByRole('cell');
      
      // Check headers are present
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('(index)');
      expect(headers[1]).toHaveTextContent('name');
      expect(headers[2]).toHaveTextContent('age');
      expect(headers[3]).toHaveTextContent('city');

      // Check data in specific cells
      expect(cells[0]).toHaveTextContent('0');
      expect(cells[1]).toHaveTextContent('"John"');
      expect(cells[2]).toHaveTextContent('30');
      expect(cells[3]).toHaveTextContent(''); // Empty cell for undefined
      expect(cells[4]).toHaveTextContent('1');
      expect(cells[5]).toHaveTextContent('"Jane"');
      expect(cells[6]).toHaveTextContent(''); // Empty cell for undefined
      expect(cells[7]).toHaveTextContent('"London"');
    });
  });

  describe('array of primitives', () => {
    it('renders table with value column for primitive arrays', () => {
      const data = ['one', 2, true];

      render(<ConsoleTable value={data} />);

      const cells = screen.getAllByRole('cell');
      const headers = screen.getAllByRole('columnheader');

      // Check headers
      expect(headers[0]).toHaveTextContent('(index)');
      expect(headers[1]).toHaveTextContent('value');

      // Check data in specific cells
      expect(cells[0]).toHaveTextContent('0');
      expect(cells[1]).toHaveTextContent('"one"');
      expect(cells[2]).toHaveTextContent('1');
      expect(cells[3]).toHaveTextContent('2');
      expect(cells[4]).toHaveTextContent('2');
      expect(cells[5]).toHaveTextContent('true');
    });
  });

  describe('nested structures', () => {
    it('renders nested objects in table cells', () => {
      const data = [
        { user: { name: 'John', age: 30 }, active: true },
        { user: { name: 'Jane', age: 25 }, active: false }
      ];

      render(<ConsoleTable value={data} />);

      const cells = screen.getAllByRole('cell');
      const headers = screen.getAllByRole('columnheader');

      expect(headers[0]).toHaveTextContent('(index)');
      expect(headers[1]).toHaveTextContent('user');
      expect(headers[2]).toHaveTextContent('active');

      // Check object previews and boolean values
      expect(within(cells[1]).getByText(/▶ Object/)).toBeInTheDocument();
      expect(cells[2]).toHaveTextContent('true');
      expect(within(cells[4]).getByText(/▶ Object/)).toBeInTheDocument();
      expect(cells[5]).toHaveTextContent('false');
    });

    it('renders nested arrays in table cells', () => {
      const data = [
        { name: 'John', scores: [85, 92, 78] },
        { name: 'Jane', scores: [95, 88, 82] }
      ];

      render(<ConsoleTable value={data} />);

      const cells = screen.getAllByRole('cell');
      const headers = screen.getAllByRole('columnheader');

      expect(headers[0]).toHaveTextContent('(index)');
      expect(headers[1]).toHaveTextContent('name');
      expect(headers[2]).toHaveTextContent('scores');

      // Check array previews
      expect(within(cells[2]).getByText(/▶ Array/)).toBeInTheDocument();
      expect(within(cells[2]).getByText(/\(3\)/)).toBeInTheDocument();
      expect(within(cells[5]).getByText(/▶ Array/)).toBeInTheDocument();
      expect(within(cells[5]).getByText(/\(3\)/)).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('handles empty array', () => {
      render(<ConsoleTable value={[]} />);
      
      const headers = screen.getAllByRole('columnheader');
      expect(headers[0]).toHaveTextContent('(index)');
      expect(headers[1]).toHaveTextContent('value');
      
      // Should have no data cells
      expect(screen.queryByRole('cell')).not.toBeInTheDocument();
    });

    it('handles null and undefined values', () => {
      const data = [
        { name: 'John', value: null },
        { name: 'Jane', value: undefined }
      ];

      render(<ConsoleTable value={data} />);

      const cells = screen.getAllByRole('cell');
      
      // Check null and undefined cells
      expect(cells[2]).toHaveTextContent('null');
      expect(cells[5]).toHaveTextContent(''); // Empty for undefined
    });
  });
}); 