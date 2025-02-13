import React, { useState, useEffect } from 'react';
import { ConsoleOutputProps } from 'types/console';
import { ConsoleOutput } from './ConsoleOutput';
import { 
  PROMISE_STATES, 
  PromiseState 
} from '@constants/promise';

interface ConsolePromiseProps {
  value: Promise<any>;
  type: ConsoleOutputProps['type'];
}

const formatError = (error: unknown): string => 
  error instanceof Error 
    ? `${error.name}: ${error.message}\n${error.stack}`
    : String(error);

export const ConsolePromise: React.FC<ConsolePromiseProps> = ({ value, type }) => {
  const [promiseState, setPromiseState] = useState<PromiseState>(PROMISE_STATES.PENDING);
  const [promiseResult, setPromiseResult] = useState<any>(undefined);

  useEffect(() => {
    let mounted = true;

    const checkPromiseState = async () => {
      // Check if promise is already settled (fulfilled or rejected)
      const immediateState = await Promise.race([
        // This promise resolves when the value settles
        value.then(
          () => PROMISE_STATES.FULFILLED,
          () => PROMISE_STATES.REJECTED
        ),
        // This promise resolves in the next tick
        new Promise<PromiseState>(resolve => setTimeout(() => resolve(PROMISE_STATES.PENDING), 0))
      ]);

      if (!mounted) return;

      if (immediateState !== PROMISE_STATES.PENDING) {
        const result = await value.catch(error => {
          console.error(`Uncaught (in promise) ${formatError(error)}`);
          return error;
        });
        if (mounted) {
          setPromiseState(immediateState);
          setPromiseResult(result);
        }
      } else {
        // For non-immediate promises, only handle rejections
        value.catch(error => {
          if (mounted) {
            console.error(`Uncaught (in promise) ${formatError(error)}`);
          }
        });
      }
    };

    checkPromiseState();

    return () => {
      mounted = false;
    };
  }, [value]);

  const promiseStatus = `{<${promiseState}>}`;

  return (
    <>
      <span style={{ color: '#82aaff' }}>
        Promise {promiseStatus}
      </span>
      {promiseState !== PROMISE_STATES.PENDING && promiseResult !== undefined && (
        <ConsoleOutput value={promiseResult} type={type} />
      )}
    </>
  );
}; 
