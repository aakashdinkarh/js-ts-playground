import React, { useState } from 'react';
import type { ConsoleOutputProps } from 'types/console';
import { ConsoleOutput } from '@common/ConsoleOutput';
import { copyToClipboard } from '@utils/clipboard';
import { ConsoleObjectContent } from '@common/ConsoleObjectContent';
import { ConsolePrimitive } from '@common/ConsolePrimitive';
import { formatArrayPreview } from '@utils/console/formatters';

interface ConsoleArrayItemProps {
  val: unknown;
  idx: number;
  type: ConsoleOutputProps['type'];
}

export const ConsoleArrayItem: React.FC<ConsoleArrayItemProps> = ({ val, idx, type }) => {
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
              {isArrayExpanded ? '▼' : '▶'} ({val.length}) [{formatArrayPreview(val)}]
              <button className="copy-btn" onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(val);
              }}>📋</button>
            </span>
            {isArrayExpanded && (
              <ConsoleObjectContent 
                entries={val.map((item, i) => [String(i), item])} 
                depth={1} 
                type={type}
              />
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
      <ConsolePrimitive value={val} type={type} />
    </React.Fragment>
  );
};
