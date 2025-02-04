import React from 'react';
import { ConsoleOutputProps } from 'types/console';
import { ConsoleOutput } from '@common/ConsoleOutput';
import { ConsolePrimitive } from '@common/ConsolePrimitive';

interface ConsoleObjectContentProps {
  entries: [string, any][];
  depth: number;
  type: ConsoleOutputProps['type'];
  seen?: WeakSet<any>;
}

export const ConsoleObjectContent: React.FC<ConsoleObjectContentProps> = ({ 
  entries,
  depth,
  type,
  seen = new WeakSet()
}) => (
  <div className="object-content">
    {entries.map(([key, val]) => {
      if (typeof val === 'object' && val !== null) {
        seen.add(val);
      }
      
      const isCircular = typeof val === 'object' && val !== null && seen.has(val);
      
      return (
        <div key={key} className="object-property">
          <span className="property-key">{JSON.stringify(key)}: </span>
          <span className="property-value">
            {isCircular ? (
              '[Circular]'
            ) : (
              typeof val === 'object' && val !== null ? (
                <ConsoleOutput 
                  value={val} 
                  depth={depth + 1} 
                  type={type} 
                  seen={seen}
                />
              ) : (
                <ConsolePrimitive value={val} type={type} />
              )
            )}
          </span>
        </div>
      );
    })}
  </div>
); 