import { render, screen } from '@testing-library/react';
import { ConsoleObjectContent } from '@common/ConsoleObjectContent';
import { CONSOLE_METHODS } from '@constants/console';

describe('ConsoleObjectContent', () => {
  describe('rendering primitive values', () => {
    it('renders string entries correctly', () => {
      const entries: [string, any][] = [
        ['name', 'test'],
        ['description', 'sample']
      ];
      
      render(
        <ConsoleObjectContent 
          entries={entries} 
          depth={0} 
          type={CONSOLE_METHODS.LOG} 
        />
      );

      expect(screen.getByText('"name":')).toBeInTheDocument();
      expect(screen.getByText('"test"')).toBeInTheDocument();
      expect(screen.getByText('"description":')).toBeInTheDocument();
      expect(screen.getByText('"sample"')).toBeInTheDocument();
    });

    it('renders number entries correctly', () => {
      const entries: [string, any][] = [
        ['count', 42],
        ['price', 99.99]
      ];
      
      render(
        <ConsoleObjectContent 
          entries={entries} 
          depth={0} 
          type={CONSOLE_METHODS.LOG} 
        />
      );

      expect(screen.getByText('"count":')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
      expect(screen.getByText('"price":')).toBeInTheDocument();
      expect(screen.getByText('99.99')).toBeInTheDocument();
    });

    it('renders boolean entries correctly', () => {
      const entries: [string, any][] = [
        ['isActive', true],
        ['isDeleted', false]
      ];
      
      render(
        <ConsoleObjectContent 
          entries={entries} 
          depth={0} 
          type={CONSOLE_METHODS.LOG} 
        />
      );

      expect(screen.getByText('"isActive":')).toBeInTheDocument();
      expect(screen.getByText('true')).toBeInTheDocument();
      expect(screen.getByText('"isDeleted":')).toBeInTheDocument();
      expect(screen.getByText('false')).toBeInTheDocument();
    });

    it('renders null and undefined entries correctly', () => {
      const entries: [string, any][] = [
        ['nullValue', null],
        ['undefinedValue', undefined]
      ];
      
      render(
        <ConsoleObjectContent 
          entries={entries} 
          depth={0} 
          type={CONSOLE_METHODS.LOG} 
        />
      );

      expect(screen.getByText('"nullValue":')).toBeInTheDocument();
      expect(screen.getByText('null')).toBeInTheDocument();
      expect(screen.getByText('"undefinedValue":')).toBeInTheDocument();
      expect(screen.getByText('undefined')).toBeInTheDocument();
    });
  });

  describe('rendering nested structures', () => {
    it('renders nested object entries correctly', () => {
      const entries: [string, any][] = [
        ['user', { name: 'John', age: 30 }]
      ];
      
      render(
        <ConsoleObjectContent 
          entries={entries} 
          depth={0} 
          type={CONSOLE_METHODS.LOG} 
        />
      );

      expect(screen.getByText('"user":')).toBeInTheDocument();
      expect(screen.getByText(/Object/)).toBeInTheDocument();
      expect(screen.getByTestId('expandable')).toBeInTheDocument();
    });

    it('renders array entries correctly', () => {
      const entries: [string, any][] = [
        ['items', [1, 2, 3]]
      ];
      
      render(
        <ConsoleObjectContent 
          entries={entries} 
          depth={0} 
          type={CONSOLE_METHODS.LOG} 
        />
      );

      expect(screen.getByText('"items":')).toBeInTheDocument();
      expect(screen.getByText(/Array/)).toBeInTheDocument();
      expect(screen.getByText(/\(3\)/)).toBeInTheDocument();
    });
  });

  describe('circular reference handling', () => {
    it('handles circular references in objects', () => {
      const circular: any = {};
      circular.self = circular;
      
      const entries: [string, any][] = [
        ['circular', circular]
      ];
      
      const seen = new WeakMap();
      seen.set(circular, 'CircularObject');

      render(
        <ConsoleObjectContent 
          entries={entries} 
          depth={0} 
          type={CONSOLE_METHODS.LOG}
          seen={seen}
        />
      );

      expect(screen.getByText(/CircularObject/)).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('renders error entries with proper formatting', () => {
      const error = new Error('Test error');
      const entries: [string, any][] = [
        ['error', error]
      ];
      
      render(
        <ConsoleObjectContent 
          entries={entries} 
          depth={0} 
          type={CONSOLE_METHODS.ERROR} 
        />
      );

      expect(screen.getByText('"error":')).toBeInTheDocument();
      expect(screen.getByText('▶ Error')).toBeInTheDocument();
    });
  });
}); 