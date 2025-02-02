import React from 'react';
import { CONSOLE_METHODS } from '@constants/console';
import { ConsoleMethodTypeExcludingTable, ConsoleOutputProps } from 'types/console';
import { getTypeClass } from '@utils/console/get-type-class';
import { ConsoleArrayItem } from '@common/ConsoleArrayItem';
import { ConsoleTable } from '@common/ConsoleTable';
import { ConsoleObject } from '@common/ConsoleObject';
import { ConsolePrimitive } from '@common/ConsolePrimitive';

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  value,
  depth = 0,
  type = CONSOLE_METHODS.LOG
}) => {
  if (Array.isArray(value)) {
    if (depth === 0 && [
      CONSOLE_METHODS.LOG,
      CONSOLE_METHODS.WARN,
      CONSOLE_METHODS.ERROR,
      CONSOLE_METHODS.INFO,
      CONSOLE_METHODS.DEBUG,
      CONSOLE_METHODS.TIME,
      CONSOLE_METHODS.TIME_END,
    ].includes(type as ConsoleMethodTypeExcludingTable)) {
      return (
        <div className={`${getTypeClass(type)} depth-0`}>
          {value.map((val, idx) => (
            <div key={idx} className='console-line'>
              <ConsoleArrayItem val={val} idx={idx} type={type} />
            </div>
          ))}
        </div>
      );
    }

    if (type === CONSOLE_METHODS.TABLE) {
      return <ConsoleTable value={value} />;
    }

    return <ConsoleObject value={value} type={type} depth={depth} label={`Array(${value.length})`} />;
  }

  if (value instanceof Date) {
    return <ConsolePrimitive value={value} type={type} />;
  }

  if (value instanceof RegExp) {
    return <ConsolePrimitive value={value} type={type} />;
  }

  if (value instanceof Promise) {
    return <ConsolePrimitive value={value} type={type} />;
  }

  if (value instanceof Map) {
    return <ConsoleObject 
      value={Object.fromEntries(value)} 
      type={type} 
      depth={depth} 
      label={`Map(${value.size})`} 
    />;
  }

  if (value instanceof Set) {
    return <ConsoleObject 
      value={Array.from(value)} 
      type={type} 
      depth={depth} 
      label={`Set(${value.size})`} 
    />;
  }

  if (value instanceof Error) {
    return <ConsoleObject 
      value={{ 
        message: value.message, 
        stack: value.stack,
        ...(value.cause ? { cause: value.cause } : {})
      }} 
      type={type} 
      depth={depth} 
      label={value.name} 
    />;
  }

  if (typeof value === 'object' && value !== null) {
    return <ConsoleObject value={value} type={type} depth={depth} />;
  }

  return <ConsolePrimitive value={value} type={type} />;
};
