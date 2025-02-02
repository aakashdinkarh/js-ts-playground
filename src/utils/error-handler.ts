import { SetOutputFunction } from 'types/console';
import { CONSOLE_METHODS } from '@constants/console';

export const createWrappedCode = (code: string) => `
  try {
    ${code}
  } catch (error) {
    __handleError(error);
  }
`;

export const handleEvalError = (error: unknown, setOutput: SetOutputFunction) => {
  setOutput(prev => [...prev, { 
    type: CONSOLE_METHODS.ERROR, 
    value: [error instanceof Error 
      ? `${error.name}: ${error.message}\n${error.stack}`
      : String(error)
    ] 
  }]);
}; 
