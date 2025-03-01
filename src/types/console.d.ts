import { SetStateAction } from 'react';
import { CONSOLE_METHODS } from '@constants/console';

export type ConsoleMethodType = typeof CONSOLE_METHODS[keyof typeof CONSOLE_METHODS];
export type SetOutputFunction = (value: SetStateAction<ConsoleMessage[]>) => void;
export type ConsoleMethodTypeExcludingTable = Exclude<ConsoleMethodType, typeof CONSOLE_METHODS.TABLE>;

export interface ConsoleMessage {
  type: ConsoleMethodType;
  value: unknown[];
}

export interface TimeData {
  [label: string]: number;
}

export interface ConsoleOutputProps {
  value: unknown;
  depth?: number;
  type?: ConsoleMethodType;
  seen?: WeakMap<unknown, string>;
}

export interface ConsoleOutputContainerProps {
  output: ConsoleMessage[];
  setOutput: SetOutputFunction;
}
