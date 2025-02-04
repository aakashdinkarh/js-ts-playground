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
  seen?: WeakSet<any>;
}

export const ConsoleObject: React.FC<ConsoleObjectProps> = ({ 
  value, 
  type, 
  depth = 0,
  label = value.constructor.name,
  seen = new WeakSet()
}) => {
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyToClipboard(value);
  };

  return (
    <div className={`console-item ${getTypeClass(type)}`}>
      <span className="expandable" onClick={() => setIsExpanded(!isExpanded)}>
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