import { CONSOLE_METHODS } from '@constants/console';
import React from 'react';
import { ConsoleOutput } from '@common/ConsoleOutput';
interface ConsoleTableProps {
  value: any[];
}

export const ConsoleTable: React.FC<ConsoleTableProps> = ({ value }) => {
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
                  <ConsoleOutput value={cell} depth={1} type={CONSOLE_METHODS.LOG} />
                  {/* {typeof cell === 'object'
                    ? JSON.stringify(cell)
                    : String(cell)} */}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 