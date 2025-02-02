import React from 'react';
import { BUTTON_VARIANTS, BUTTON_SIZES } from '@constants/button';
import { ButtonProps } from 'types/common';

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = BUTTON_VARIANTS.PRIMARY, 
  size = BUTTON_SIZES.MEDIUM,
  className = '',
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} btn-${size} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
