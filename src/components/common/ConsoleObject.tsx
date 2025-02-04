import React, { useState } from 'react';
import { ConsoleOutputProps } from 'types/console';
import { getTypeClass } from '@utils/console/get-type-class';
import { copyToClipboard } from '@utils/clipboard';
import { ConsoleObjectContent } from '@common/ConsoleObjectContent';

interface ConsoleObjectProps {
  value: any;
  type: ConsoleOutputProps['type'];
  depth?: number;
  label?: string;
  seen?: WeakMap<any, string>;
}

export const ConsoleObject: React.FC<ConsoleObjectProps> = ({ 
  value, 
  type, 
  depth = 0,
  label = value.constructor.name,
  seen = new WeakMap()
}) => {
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(value);
  };

  // Add the current object to seen map before rendering its content
  if (typeof value === 'object' && value !== null && !seen.has(value)) {
    seen.set(value, label);
  }

  return (
    <div className={`console-item ${getTypeClass(type)}`}>
      <span className="expandable" data-testid="expandable" onClick={() => setIsExpanded(!isExpanded)}>
        {isExpanded ? '▼' : '▶'} {label}
        <button className="copy-btn" onClick={handleCopy}>📋</button>
      </span>
      {isExpanded && (
        <ConsoleObjectContent 
          entries={Object.entries(value)} 
          depth={depth} 
          type={type}
          seen={seen}
        />
      )}
    </div>
  );
}; 