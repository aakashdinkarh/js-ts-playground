import { Language } from '@constants/app';
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
