import React, { useState } from 'react';

interface ConsoleOutputProps {
  value: any;
  depth?: number;
}

const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ value, depth = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
  };

  if (typeof value === 'object' && value !== null) {
    return (
      <div className="console-item">
        <span 
          className="expandable" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▶'} {value.constructor.name} 
          <button className="copy-btn" onClick={handleCopy}>📋</button>
        </span>
        {isExpanded && (
          <div className="object-content">
            {Object.entries(value).map(([key, val]) => (
              <div key={key} className="object-property">
                <span className="property-key">{key}: </span>
                <span className="property-value">
                  {typeof val === 'object' && val !== null 
                    ? <ConsoleOutput value={val} depth={depth + 1} />
                    : String(val)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <span>{String(value)}</span>;
};

export default ConsoleOutput; 