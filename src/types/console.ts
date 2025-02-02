import { SetStateAction } from 'react';

export type ConsoleMethodType = 'log' | 'error' | 'warn' | 'info' | 'debug' | 'table' | 'time' | 'timeEnd';
export type SetOutputFunction = (value: SetStateAction<ConsoleMessage[]>) => void;

export interface ConsoleMessage {
  type: ConsoleMethodType;
  value: any[];
}

export interface TimeData {
  [label: string]: number;
}

export interface ConsoleOutputProps {
  value: any;
  depth?: number;
  type?: ConsoleMethodType;
}

export interface ConsoleOutputContainerProps {
  output: ConsoleMessage[];
} 