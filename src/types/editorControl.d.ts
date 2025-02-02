export interface EditorControlsProps {
  onRun: () => void;
  onClear: () => void;
  autoRun: boolean;
  setAutoRun: (value: boolean) => void;
}
