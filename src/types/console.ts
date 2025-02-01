export type ConsoleMethodType = 'log' | 'error' | 'warn' | 'info' | 'debug';
export type SetOutputFunction = (value: React.SetStateAction<any[]>) => void;

export interface ConsoleMessage {
  type: ConsoleMethodType;
  value: any;
} 