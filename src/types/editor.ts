import { Language } from '@constants/index';
import { SetOutputFunction } from 'types/console';

export interface EditorBaseProps {
  language: Language;
  handleCodeExecution: (code: string, setOutput: SetOutputFunction) => void;
}

export interface EditorControlsProps {
  onRun: () => void;
  onClear: () => void;
  autoRun: boolean;
  setAutoRun: (value: boolean) => void;
}

export interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
} 