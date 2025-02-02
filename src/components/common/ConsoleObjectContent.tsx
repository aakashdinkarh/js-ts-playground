import React from 'react';
import { ConsoleOutputProps } from 'types/console';
import { ConsoleOutput } from '@common/ConsoleOutput';
import { ConsolePrimitive } from '@common/ConsolePrimitive';

interface ConsoleObjectContentProps {
  entries: [string, any][];
  depth: number;
  type: ConsoleOutputProps['type'];
}

export const ConsoleObjectContent: React.FC<ConsoleObjectContentProps> = ({ 
  entries,
  depth,
  type 
}) => (
  <div className="object-content">
    {entries.map(([key, val]) => (
      <div key={key} className="object-property">
        <span className="property-key">{key}: </span>
        <span className="property-value">
          {typeof val === 'object' && val !== null
            ? <ConsoleOutput value={val} depth={depth + 1} type={type} />
            : <ConsolePrimitive value={val} type={type} />}
        </span>
      </div>
    ))}
  </div>
); 