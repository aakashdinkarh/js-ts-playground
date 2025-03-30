import React from 'react';
import { BUTTON_VARIANTS } from '@constants/button';
import type { ButtonProps } from 'types/common';

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = BUTTON_VARIANTS.PRIMARY, 
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
