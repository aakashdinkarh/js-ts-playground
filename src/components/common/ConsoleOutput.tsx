import React from 'react';
import { CONSOLE_METHODS } from '@constants/console';
import { ConsoleMethodTypeExcludingTable, ConsoleOutputProps } from 'types/console';
import { getTypeClass } from '@utils/console/get-type-class';
import { ConsoleArrayItem } from '@common/ConsoleArrayItem';
import { ConsoleTable } from '@common/ConsoleTable';
import { ConsoleObject } from '@common/ConsoleObject';

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

  if (typeof value === 'object' && value !== null) {
    return <ConsoleObject value={value} type={type} depth={depth} />;
  }

  return <span className={getTypeClass(type)}>{String(value)}</span>;
};


// todo:
// - render boolean and number with colors
// - render null and undefined with colors
// - render function with colors
// - render symbol with colors
// - render bigint with colors
// - render date with colors
// - render regexp with colors
// - render error with colors
// - render map with colors
// - render set with colors
// - render promise with colors
// - render array with colors
// - render object with colors
// - render string with colors
// - render number with colors
// - render bigint with colors
// - render boolean with colors
// - render symbol with colors
// - render function with colors  