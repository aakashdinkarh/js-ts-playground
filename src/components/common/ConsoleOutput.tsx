import React, { useState } from 'react';

interface ConsoleOutputProps {
  value: any;
  depth?: number;
  type?: 'log' | 'error' | 'warn' | 'info' | 'debug' | 'table' | 'time' | 'timeEnd';
}

// Add CSS classes based on console type
const getTypeClass = (type: ConsoleOutputProps['type']) => {
  switch (type) {
    case 'error': return 'console-error';
    case 'warn': return 'console-warn';
    case 'info': return 'console-info';
    case 'debug': return 'console-debug';
    case 'time': return 'console-time';
    case 'timeEnd': return 'console-time';
    default: return '';
  }
};

const ArrayItem: React.FC<{ val: any; idx: number; type: ConsoleOutputProps['type'] }> = ({ val, idx, type }) => {
  const [isArrayExpanded, setArrayExpanded] = useState(false);

  if (typeof val === 'object' && val !== null) {
    if (Array.isArray(val)) {
      return (
        <React.Fragment>
          {idx > 0 && ' '}
          <div className="console-item">
            <span 
              className="expandable" 
              onClick={() => setArrayExpanded(!isArrayExpanded)}
            >
              {isArrayExpanded ? '▼' : '▶'} ({val.length}) [{val.join(', ')}]
              <button className="copy-btn" onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(JSON.stringify(val, null, 2));
              }}>📋</button>
            </span>
            {isArrayExpanded && (
              <div className="object-content">
                {val.map((item, index) => (
                  <div key={index} className="object-property">
                    <span className="property-key">{index}: </span>
                    <span className="property-value">
                      {typeof item === 'object' && item !== null 
                        ? <ConsoleOutput value={item} depth={1} type={type} />
                        : String(item)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {idx > 0 && ' '}
        <ConsoleOutput value={val} depth={0} type={type} />
      </React.Fragment>
    );
  }
  return (
    <React.Fragment>
      {idx > 0 && ' '}
      {String(val)}
    </React.Fragment>
  );
};

export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({ 
  value, 
  depth = 0, 
  type = 'log' 
}) => {
  const [isExpanded, setIsExpanded] = useState(depth === 0);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
  };


  if (Array.isArray(value)) {
    // For multiple arguments in console methods
    if (depth === 0 && ['log', 'warn', 'error', 'info', 'debug', 'time', 'timeEnd'].includes(type)) {
      return (
        <div className={`${getTypeClass(type)} depth-0`}>
          {value.map((val, idx) => (
            <div key={idx} className="console-line">
              <ArrayItem val={val} idx={idx} type={type} />
            </div>
          ))}
        </div>
      );
    }

    if (type === 'table') {
      return (
        <div className="console-table">
          <table>
            <thead>
              <tr>
                <th>(index)</th>
                {value[0] && Object.keys(value[0]).map(key => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.map((row, index) => (
                <tr key={index}>
                  <td>{index}</td>
                  {Object.values(row).map((cell, cellIndex) => (
                    <td key={cellIndex}>
                      {typeof cell === 'object' 
                        ? JSON.stringify(cell) 
                        : String(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
    // If it's a single object passed to console.log, unwrap it
    if (value.length === 1 && typeof value[0] === 'object' && value[0] !== null) {
      return <ConsoleOutput value={value[0]} depth={depth} type={type} />;
    }
    // If it's an array itself being logged
    if (depth === 0 && type === 'log') {
      return <ConsoleOutput value={value[0]} depth={depth} type={type} />;
    }
    // If it's an array property or array being displayed
    return (
      <div className={`console-item ${getTypeClass(type)}`}>
        <span 
          className="expandable" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '▼' : '▶'} Array({value.length})
          <button className="copy-btn" onClick={handleCopy}>📋</button>
        </span>
        {isExpanded && (
          <div className="object-content">
            {value.map((val, index) => (
              <div key={index} className="object-property">
                <span className="property-key">{index}: </span>
                <span className="property-value">
                  {typeof val === 'object' && val !== null 
                    ? <ConsoleOutput value={val} depth={depth + 1} type={type} />
                    : String(val)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <div className={`console-item ${getTypeClass(type)}`}>
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
                    ? <ConsoleOutput value={val} depth={depth + 1} type={type} />
                    : String(val)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return <span className={getTypeClass(type)}>{String(value)}</span>;
};
