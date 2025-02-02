import { BUTTON_VARIANTS, BUTTON_SIZES } from "@constants/button";

export interface TabProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
} 

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: typeof BUTTON_VARIANTS[keyof typeof BUTTON_VARIANTS];
  size?: typeof BUTTON_SIZES[keyof typeof BUTTON_SIZES];
}
