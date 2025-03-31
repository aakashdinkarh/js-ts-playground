import React, { useCallback } from 'react';
import { ConsoleOutput } from '@common/ConsoleOutput';
import type { ConsoleOutputContainerProps } from 'types/console';
import { Button } from '@common/Button';
import { CONSOLE_METHODS } from '@constants/console';

export const ConsoleOutputContainer: React.FC<ConsoleOutputContainerProps> = ({ output, setOutput }) => {
  const handleClearConsole = useCallback(() => {
    setOutput([]);
  }, [setOutput]);

  const errorCount = output.filter(msg => msg.type === CONSOLE_METHODS.ERROR).length;
  const warningCount = output.filter(msg => msg.type === CONSOLE_METHODS.WARN).length;

  return (
    <div className='console-output-container'>
      <div className='controls'>
        <Button title='Clear Console' variant="icon" className='clear-console-btn' onClick={handleClearConsole}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8 7.92 7.92 0 0 1 1.69-4.9L16.9 18.31A7.92 7.92 0 0 1 12 20m6.31-3.1L7.1 5.69A7.92 7.92 0 0 1 12 4a8 8 0 0 1 8 8 7.92 7.92 0 0 1-1.69 4.9"/></svg>
        </Button>
        {(errorCount > 0 || warningCount > 0) && (
          <div className="console-stats">
            {errorCount > 0 && <span className="error-count">{errorCount} error{errorCount !== 1 ? 's' : ''}</span>}
            {warningCount > 0 && <span className="warning-count">{warningCount} warning{warningCount !== 1 ? 's' : ''}</span>}
          </div>
        )}
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
