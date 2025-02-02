export type ConsoleMethodType = 'log' | 'error' | 'warn' | 'info' | 'debug' | 'table' | 'time' | 'timeEnd';
export type SetOutputFunction = (value: React.SetStateAction<any[]>) => void;

export interface ConsoleMessage {
  type: ConsoleMethodType;
  value: any;
}

export interface TimeData {
  [label: string]: number;
} 