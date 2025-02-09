import React from 'react';
import { ConsoleOutput } from '@common/ConsoleOutput';
import { CONSOLE_METHODS } from '@constants/console';
import { getTableHeaders, isPrimitiveArray, getCellValue } from '@utils/console/table';

interface ConsoleTableProps {
  value: any[];
}

export const ConsoleTable: React.FC<ConsoleTableProps> = ({ value }) => {
  const tableHeaders = getTableHeaders(value);
  const isPrimitive = isPrimitiveArray(value);

  const renderCell = (value: any) => {
    if (value === undefined) return '';
    return <ConsoleOutput value={value} depth={1} type={CONSOLE_METHODS.LOG} />;
  };

  return (
    <div className="console-table">
      <table>
        <thead>
          <tr>
            <th>(index)</th>
            {tableHeaders.map(header => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {value.map((row, index) => (
            <tr key={index}>
              <td>{index}</td>
              {tableHeaders.map(header => (
                <td key={header}>
                  {renderCell(getCellValue(row, header, isPrimitive))}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 