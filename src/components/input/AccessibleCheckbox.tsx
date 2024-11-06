import React, { useState, useEffect } from 'react';
import './AccessibleCheckbox.css';
interface AccessibleCheckboxProps {
  text: string;
  ariaLabel: string;
  className?: string;
  disabled?: boolean;
  inputId: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AccessibleCheckbox: React.FC<AccessibleCheckboxProps> = ({
  text,
  ariaLabel,
  className,
  disabled,
  inputId,
  name,
  onChange,
}) => {
  const [selected, setSelected] = useState(false);
  useEffect(() => {
    if (onChange) {
      onChange({
        target: { checked: selected },
      } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [selected, onChange]);
  return (
    <div>
      <input
        id={inputId}
        name={name}
        aria-label={ariaLabel}
        disabled={disabled}
        checked={selected}
        onChange={() => setSelected(!selected)}
        style={{ width: '2em', height: '2em' }}
        className={`standard-shadow background-color ${className}`}
        onClick={() => setSelected(!selected)}
        onKeyDown={(e) => {
          (e.key === 'Enter' || e.key === ' ') && setSelected(!selected);
        }}
        type="checkbox"
        aria-checked={selected}
      />
      <label htmlFor={inputId} className="text-lg">
        {text}
      </label>
    </div>
  );
};

export default AccessibleCheckbox;
