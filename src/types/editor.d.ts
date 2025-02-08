import { Language } from '@constants/app';

export interface EditorBaseProps {
  language: Language;
  handleCodeExecution: (code: string) => Promise<void>;
}

export interface EditorControlsProps {
  onRun: () => void;
  onClear: () => void;
  autoRun: boolean;
  setAutoRun: (value: boolean) => void;
}
