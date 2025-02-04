import React from 'react';
import { ConsoleOutputProps } from 'types/console';
import { ConsoleOutput } from '@common/ConsoleOutput';
import { ConsolePrimitive } from '@common/ConsolePrimitive';

interface ConsoleObjectContentProps {
  entries: [string, any][];
  depth: number;
  type: ConsoleOutputProps['type'];
  seen?: WeakMap<any, string>;
}

export const ConsoleObjectContent: React.FC<ConsoleObjectContentProps> = ({ 
  entries,
  depth,
  type,
  seen = new WeakMap()
}) => (
  <div className="object-content">
    {entries.map(([key, val]) => {
      const isCircular = typeof val === 'object' && val !== null && seen.has(val);
      const path = isCircular ? seen.get(val) : undefined;
      
      // Only add to seen map if it's not already there
      if (typeof val === 'object' && val !== null && !seen.has(val)) {
        const currentPath = depth === 0 ? key : `~.${key}`;
        seen.set(val, currentPath);
      }
      
      return (
        <div key={key} className="object-property">
          <span className="property-key">{JSON.stringify(key)}: </span>
          <span className="property-value">
            {isCircular ? (
              `[Circular → ${path}]`
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