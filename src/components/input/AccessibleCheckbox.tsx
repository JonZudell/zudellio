import React, { useState, useEffect } from 'react';
import './AccessibleCheckbox.css';
interface AccessibleCheckboxProps {
  children?: React.ReactNode;
  ariaLabel: string;
  className?: string;
  checked?: boolean;
  disabled?: boolean;
  inputId: string;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const AccessibleCheckbox: React.FC<AccessibleCheckboxProps> = ({
  children,
  ariaLabel,
  className,
  checked = false,
  disabled,
  inputId,
  name,
  onChange,
}) => {
  const [keyPressed, setKeyPressed] = useState(false);

  return (
    <div className="flex items-center">
      <input
        id={inputId}
        name={name}
        aria-label={ariaLabel}
        disabled={disabled}
        checked={checked}
        onClick={() =>
          onChange({
            target: { checked: !checked },
          } as React.ChangeEvent<HTMLInputElement>)
        }
        style={{ width: '2em', height: '2em' }}
        className={`standard-shadow background-color ${className}`}
        onKeyDown={(e) => {
          if (!keyPressed && e.key === 'Enter') {
            onChange({
              target: { checked: !checked },
            } as React.ChangeEvent<HTMLInputElement>);
            setKeyPressed(true);
          }
        }}
        onKeyUp={() => setKeyPressed(false)}
        type="checkbox"
        aria-checked={checked}
      />
      <label htmlFor={inputId} className="text-lg ml-2em">
        {children}
      </label>
    </div>
  );
};

export default AccessibleCheckbox;
