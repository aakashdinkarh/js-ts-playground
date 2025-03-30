import { BUTTON_VARIANTS } from "@constants/button";

export interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: (typeof BUTTON_VARIANTS)[keyof typeof BUTTON_VARIANTS];
}

export type TUtcDate = ReturnType<(typeof Date)["prototype"]["toUTCString"]>;
