import React, { useState, useEffect } from 'react';
import { ConsoleOutputProps } from 'types/console';

interface ConsolePrimitiveProps {
  value: any;
  type: ConsoleOutputProps['type'];
}

export const ConsolePrimitive: React.FC<ConsolePrimitiveProps> = ({ value, type }) => {
  const [promiseState, setPromiseState] = useState<string>('pending');
  const [promiseResult, setPromiseResult] = useState<any>(undefined);

  useEffect(() => {
    let mounted = true;

    if (value instanceof Promise) {
      try {
        value.then(
          (result) => {
            if (mounted) {
              setPromiseState('fulfilled');
              setPromiseResult(result);
            }
          },
          (error) => {
            if (mounted) {
              setPromiseState('rejected');
              setPromiseResult(
                error instanceof Error 
                  ? `${error.name}: ${error.message}\n${error.stack}`
                  : String(error)
              );
            }
          }
        );
      } catch (error) {
        if (mounted) {
          setPromiseState('rejected');
          // @ts-ignore
          setPromiseResult(error instanceof Error 
            ? `${error.name}: ${error.message}\n${error.stack}`
            : String(error)
          );
        }
      }
    }

    return () => {
      mounted = false;
    };
  }, [value]);

  if (value === null) {
    return <span style={{ color: '#ff628c' }}>null</span>;
  }

  if (value === undefined) {
    return <span style={{ color: '#ff628c' }}>undefined</span>;
  }

  // Handle Date objects
  if (value instanceof Date) {
    return <span style={{ color: '#a8ff60' }}>{value.toString()}</span>;
  }

  // Handle RegExp
  if (value instanceof RegExp) {
    return <span style={{ color: '#ff628c' }}>{value.toString()}</span>;
  }

  // Handle Promise
  if (value instanceof Promise) {
    const isRejected = promiseState === 'rejected';
    return (
      <span style={{ color: isRejected ? '#ff628c' : '#82aaff' }}>
        Promise {`{<${promiseState}>` + (promiseResult !== undefined ? `: ${promiseResult}` : '') + '}'}
      </span>
    );
  }

  switch (typeof value) {
    case 'string':
      return <span style={{ color: '#a8ff60' }}>"{value}"</span>;
    case 'number':
      return <span style={{ color: '#ff9d00' }}>{value}</span>;
    case 'boolean':
      return <span style={{ color: '#ff628c' }}>{String(value)}</span>;
    case 'function':
      const funcStr = value.toString();
      const funcName = value.name;
      const isArrow = funcStr.includes('=>');
      return (
        <span style={{ color: '#82aaff' }}>
          ƒ {!isArrow && funcName} {funcStr.slice(funcStr.indexOf('('))}
        </span>
      );
    case 'symbol':
      return <span style={{ color: '#ff9d00' }}>Symbol({String(value).slice(7, -1)})</span>;
    case 'bigint':
      return <span style={{ color: '#ff9d00' }}>{value.toString()}n</span>;
    default:
      return <span>{String(value)}</span>;
  }
};