import React from 'react';
import './AccessibleButton.css';
import '../containers/Wrapper.css';

interface ButtonProps {
  inputId?: string;
  text: string;
  ariaLabel: string;
  decorationLeft?: string;
  decorationRight?: string;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClick?: Function;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const AccessibleButton: React.FC<ButtonProps> = ({
  inputId,
  text,
  className,
  onClick,
  ariaLabel,
  disabled = false,
  type,
}) => {
  const firstLetter = text.charAt(0);
  const restOfText = text.slice(1);

  // eslint-disable-next-line
  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (onClick) {
      // if key is enter or space
      if (event.key === 'Enter') {
        onClick();
      }
    }
  };
  return (
    <button
      id={inputId}
      tabIndex={0}
      className={`${className} mx-auto wrapper border-wrapper focus group cursor-pointer button focus:button hover:button active:button`}
      aria-label={ariaLabel}
      onClick={onClick && !disabled ? () => onClick() : undefined}
      onKeyDown={handleKeyDown}
      type={type}
      style={{ padding: '8px', marginBottom: '2em' }}
    >
      <span className="underline link-accent">{firstLetter}</span>
      <span className="group-hover:button-inner">{restOfText}</span>
    </button>
  );
};

export default AccessibleButton;
