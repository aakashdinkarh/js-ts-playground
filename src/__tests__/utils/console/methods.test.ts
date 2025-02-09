import { CONSOLE_METHODS } from '@constants/console';
import {
  createConsoleMethod,
  createTableMethod,
  createTimeMethod,
  createTimeEndMethod,
} from '@utils/console/methods';

describe('Console Methods', () => {
  let setOutput: jest.Mock;

  beforeEach(() => {
    setOutput = jest.fn();
    // Reset performance.now mock before each test
    jest.spyOn(performance, 'now').mockReset();
  });

  describe('createConsoleMethod', () => {
    it('should create a method that adds output with correct type and value', () => {
      const logMethod = createConsoleMethod(CONSOLE_METHODS.LOG, setOutput);
      logMethod('test message', { data: 123 });

      expect(setOutput).toHaveBeenCalledTimes(1);
      expect(setOutput.mock.calls[0][0]([])).toEqual([
        {
          type: CONSOLE_METHODS.LOG,
          value: ['test message', { data: 123 }],
        },
      ]);
    });
  });

  describe('createTableMethod', () => {
    it('should handle array input', () => {
      const tableMethod = createTableMethod(setOutput);
      const data = [{ id: 1, name: 'test' }];
      tableMethod(data);

      expect(setOutput).toHaveBeenCalledTimes(1);
      expect(setOutput.mock.calls[0][0]([])).toEqual([
        {
          type: CONSOLE_METHODS.TABLE,
          value: data,
        },
      ]);
    });

    it('should wrap non-array input in array', () => {
      const tableMethod = createTableMethod(setOutput);
      const data = { id: 1, name: 'test' };
      tableMethod(data);

      expect(setOutput).toHaveBeenCalledTimes(1);
      expect(setOutput.mock.calls[0][0]([])).toEqual([
        {
          type: CONSOLE_METHODS.TABLE,
          value: [data],
        },
      ]);
    });
  });

  describe('createTimeMethod', () => {
    beforeEach(() => {
      jest.spyOn(performance, 'now').mockImplementation(() => 1000);
    });

    it('should start timer with default label', () => {
      const timeMethod = createTimeMethod(setOutput);
      timeMethod();

      expect(setOutput).toHaveBeenCalledTimes(1);
      expect(setOutput.mock.calls[0][0]([])).toEqual([
        {
          type: CONSOLE_METHODS.TIME,
          value: ["Timer 'default' started"],
        },
      ]);
    });

    it('should start timer with custom label', () => {
      const timeMethod = createTimeMethod(setOutput);
      timeMethod('customTimer');

      expect(setOutput).toHaveBeenCalledTimes(1);
      expect(setOutput.mock.calls[0][0]([])).toEqual([
        {
          type: CONSOLE_METHODS.TIME,
          value: ["Timer 'customTimer' started"],
        },
      ]);
    });
  });

  describe('createTimeEndMethod', () => {
    let timeMethod: ReturnType<typeof createTimeMethod>;
    let timeEndMethod: ReturnType<typeof createTimeEndMethod>;

    beforeEach(() => {
      const nowMock = jest.spyOn(performance, 'now');
      // First call returns start time, second call returns end time
      nowMock.mockImplementationOnce(() => 1000).mockImplementationOnce(() => 1500);
      
      timeMethod = createTimeMethod(setOutput);
      timeEndMethod = createTimeEndMethod(setOutput);
    });

    it('should end timer and show duration for default label', () => {
      timeMethod();
      timeEndMethod();

      expect(setOutput).toHaveBeenCalledTimes(2);
      expect(setOutput.mock.calls[1][0]([])).toEqual([
        {
          type: CONSOLE_METHODS.TIME_END,
          value: ["Timer 'default': 500.00ms"],
        },
      ]);
    });

    it('should end timer and show duration for custom label', () => {
      timeMethod('customTimer');
      timeEndMethod('customTimer');

      expect(setOutput).toHaveBeenCalledTimes(2);
      expect(setOutput.mock.calls[1][0]([])).toEqual([
        {
          type: CONSOLE_METHODS.TIME_END,
          value: ["Timer 'customTimer': 500.00ms"],
        },
      ]);
    });

    it('should show error for non-existent timer', () => {
      timeEndMethod('nonExistentTimer');

      expect(setOutput).toHaveBeenCalledTimes(1);
      expect(setOutput.mock.calls[0][0]([])).toEqual([
        {
          type: CONSOLE_METHODS.ERROR,
          value: ["Timer 'nonExistentTimer' does not exist"],
        },
      ]);
    });
  });
}); 