import React from 'react';
import type { TabProps } from 'types/common';

export const Tab: React.FC<TabProps> = ({ label, isActive, onClick }) => {
  return (
    <button
      className={`tab-btn ${isActive ? 'active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};
