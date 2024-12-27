'use client';

import React, { forwardRef, CSSProperties } from 'react';

interface LatexInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  className?: string;
  style?: CSSProperties;
}

const LatexInput = forwardRef<HTMLInputElement, LatexInputProps>(({
  value,
  onChange,
  onSubmit,
  placeholder,
  className = '',
  style
}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <input
      ref={ref}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all ${className}`}
      style={style}
    />
  );
});

LatexInput.displayName = 'LatexInput';

export default LatexInput; 