import { act } from 'react';
import { render, screen } from '@testing-library/react';
import { ConsolePrimitive } from '@common/ConsolePrimitive';
import { CONSOLE_METHODS } from '@constants/console';

describe('ConsolePrimitive', () => {
  describe('primitive values', () => {
    it('renders string with quotes and green color', () => {
      render(<ConsolePrimitive value="test string" type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText('"test string"');
      expect(element).toHaveStyle({ color: '#a8ff60' });
    });

    it('renders number with orange color', () => {
      render(<ConsolePrimitive value={42} type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText('42');
      expect(element).toHaveStyle({ color: '#ff9d00' });
    });

    it('renders boolean with pink color', () => {
      render(<ConsolePrimitive value={true} type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText('true');
      expect(element).toHaveStyle({ color: '#ff628c' });
    });

    it('renders null with pink color', () => {
      render(<ConsolePrimitive value={null} type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText('null');
      expect(element).toHaveStyle({ color: '#ff628c' });
    });

    it('renders undefined with pink color', () => {
      render(<ConsolePrimitive value={undefined} type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText('undefined');
      expect(element).toHaveStyle({ color: '#ff628c' });
    });
  });

  describe('complex types', () => {
    it('renders Date object with green color', () => {
      const date = new Date('2024-01-01');
      render(<ConsolePrimitive value={date} type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText(date.toString());
      expect(element).toHaveStyle({ color: '#a8ff60' });
    });

    it('renders RegExp with pink color', () => {
      const regex = /test/g;
      render(<ConsolePrimitive value={regex} type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText('/test/g');
      expect(element).toHaveStyle({ color: '#ff628c' });
    });

    it('renders Symbol with orange color', () => {
      const sym = Symbol('test');
      render(<ConsolePrimitive value={sym} type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText('Symbol(test)');
      expect(element).toHaveStyle({ color: '#ff9d00' });
    });

    it('renders BigInt with orange color', () => {
      const bigInt = BigInt(9007199254740991);
      render(<ConsolePrimitive value={bigInt} type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText('9007199254740991n');
      expect(element).toHaveStyle({ color: '#ff9d00' });
    });

    describe('functions', () => {
      it('renders named function with blue color', () => {
        function testFunc(a: number) { return a + 1; }
        render(<ConsolePrimitive value={testFunc} type={CONSOLE_METHODS.LOG} />);
        const element = screen.getByText(/ƒ testFunc/);
        expect(element).toHaveStyle({ color: '#82aaff' });
      });

      it('renders arrow function', () => {
        const arrowFunc = (a: number) => a + 1;
        render(<ConsolePrimitive value={arrowFunc} type={CONSOLE_METHODS.LOG} />);
        const element = screen.getByText(/ƒ arrowFunc/);
        expect(element).toHaveStyle({ color: '#82aaff' });
      });

      it('renders async function correctly', () => {
        async function asyncFunc() { return Promise.resolve(1); }
        render(<ConsolePrimitive value={asyncFunc} type={CONSOLE_METHODS.LOG} />);
        const element = screen.getByText(/ƒ async/);
        expect(element).toHaveStyle({ color: '#82aaff' });
      });
    });
  });

  describe('Promise handling', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('renders pending promise with blue color', () => {
      const promise = new Promise(() => {});
      render(<ConsolePrimitive value={promise} type={CONSOLE_METHODS.LOG} />);
      const element = screen.getByText(/Promise {<pending>}/);
      expect(element).toHaveStyle({ color: '#82aaff' });
    });

    it('renders resolved promise with result', async () => {
      const promise = Promise.resolve('success');
      
      render(<ConsolePrimitive value={promise} type={CONSOLE_METHODS.LOG} />);
      
      // Initially shows pending
      expect(screen.getByText(/Promise {<pending>}/)).toBeInTheDocument();
      
      // Wait for promise to resolve
      await act(async () => {
        await promise;
      });
      
      const element = screen.getByText(/Promise {<fulfilled>: success}/);
      expect(element).toHaveStyle({ color: '#82aaff' });
    });

    it('renders rejected promise with error in pink', async () => {
      const promise = Promise.reject(new Error('test error'));
      
      render(<ConsolePrimitive value={promise} type={CONSOLE_METHODS.LOG} />);
      
      // Initially shows pending
      expect(screen.getByText(/Promise {<pending>}/)).toBeInTheDocument();
      
      // Wait for promise to reject
      await act(async () => {
        try {
          await promise;
        } catch (e) {
          // Expected rejection
        }
      });
      
      const element = screen.getByText(/Promise {<rejected>: Error: test error/);
      expect(element).toHaveStyle({ color: '#ff628c' });
    });
  });
}); 