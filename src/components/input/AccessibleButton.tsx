import React, { useRef } from 'react';
import './AccessibleButton.css';
import '../containers/Wrapper.css';

interface ButtonProps {
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
  text,
  className,
  onClick,
  ariaLabel,
  disabled = false,
  type,
}) => {
  const linkRef = useRef<HTMLButtonElement>(null);
  const firstLetter = text.charAt(0);
  const restOfText = text.slice(1);

  // eslint-disable-next-line
  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (onClick) {
      // if key is enter or space
      if (event.key === 'Enter' || event.key === ' ') {
        onClick();
      }
    }
  };
  return (
    <div className={`${className} mx-auto`}>
      <button
        ref={linkRef}
        tabIndex={0}
        className={`w-full wrapper border-wrapper focus group cursor-pointer button focus:button hover:button active:button`}
        aria-label={ariaLabel}
        onClick={onClick && !disabled ? () => onClick() : undefined}
        onKeyDown={handleKeyDown}
        type={type}
        style={{ pointerEvents: disabled ? 'none' : 'auto', padding: '6px' }}
      >
        <span className={`w-full`}>
          <span className="underline link-accent">{firstLetter}</span>
          <span className="group-hover:button-inner">{restOfText}</span>
        </span>
      </button>
    </div>
  );
};

export default AccessibleButton;
