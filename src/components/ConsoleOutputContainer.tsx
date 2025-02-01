import React from 'react';
import { ConsoleOutput } from '@components/common/ConsoleOutput';
import { ConsoleMessage } from 'types/console';

interface ConsoleOutputContainerProps {
  output: ConsoleMessage[];
}

export const ConsoleOutputContainer: React.FC<ConsoleOutputContainerProps> = ({ output }) => {
  return (
    <div className="output-container">
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
