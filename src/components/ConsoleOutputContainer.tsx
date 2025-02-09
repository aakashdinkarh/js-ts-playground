import React, { useCallback } from 'react';
import { ConsoleOutput } from '@common/ConsoleOutput';
import { ConsoleOutputContainerProps } from 'types/console';
import { Button } from '@common/Button';

export const ConsoleOutputContainer: React.FC<ConsoleOutputContainerProps> = ({ output, setOutput }) => {
  const handleClearConsole = useCallback(() => {
    setOutput([]);
  }, [setOutput]);

  return (
    <div className='console-output-container'>
      <div className='controls'>
        <Button variant="icon" className='clear-console-btn' onClick={handleClearConsole}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 7.92 7.92 0 0 1 1.69-4.9L16.9 18.31A7.92 7.92 0 0 1 12 20m6.31-3.1L7.1 5.69A7.92 7.92 0 0 1 12 4a8 8 0 0 1 8 8 7.92 7.92 0 0 1-1.69 4.9"/></svg>
        </Button>
      </div>

      <hr />

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
    </div>
  );
};
