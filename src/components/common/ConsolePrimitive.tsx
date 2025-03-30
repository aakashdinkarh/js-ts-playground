import React from 'react';
import type { ConsoleOutputProps } from 'types/console';
import { ConsolePromise } from './ConsolePromise';

interface ConsolePrimitiveProps {
  value: any;
  type: ConsoleOutputProps['type'];
}

export const ConsolePrimitive: React.FC<ConsolePrimitiveProps> = ({ value, type }) => {
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
    return <ConsolePromise value={value} type={type} />;
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