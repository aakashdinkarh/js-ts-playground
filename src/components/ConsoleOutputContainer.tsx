import React from 'react';
import ConsoleOutput from '@common/ConsoleOutput';

interface ConsoleOutputContainerProps {
  output: any[];
}

const ConsoleOutputContainer: React.FC<ConsoleOutputContainerProps> = ({ output }) => {
  return (
    <div className="output-container">
      <div id="output">
        {output.map((value, index) => (
          <div key={index} className="console-line">
            <ConsoleOutput value={value} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConsoleOutputContainer; 