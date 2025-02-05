import React from 'react';
import { ConsoleOutput } from '@components/common/ConsoleOutput';
import { ConsoleOutputContainerProps } from 'types/console';

export const ConsoleOutputContainer: React.FC<ConsoleOutputContainerProps> = ({ output }) => {
  return (
    <div 
      className="output-container" 
      role="region" 
      aria-label="output"
      data-testid="console-output-container"
    >
      <div id="output">
        {output.map((message, index) => (
          <div key={index} className="console-line">
            <ConsoleOutput value={message.value} type={message.type} />
          </div>
        ))}
      </div>
    </div>
  );
};
