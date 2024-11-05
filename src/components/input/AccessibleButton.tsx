import React, { useEffect, useRef } from 'react';
import whatInput from 'what-input';
import './AccessibleButton.css';
interface ButtonProps {
  text: string;
  ariaLabel: string;
  decorationLeft?: string;
  decorationRight?: string;
  className?: string;
  onClick?: Function;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const AccessibleButton: React.FC<ButtonProps> = ({
  text,
  decorationLeft,
  decorationRight,
  className,
  onClick,
  ariaLabel,
  disabled = false,
  type,
}) => {
  const linkRef = useRef<HTMLButtonElement>(null);
  const firstLetter = text.charAt(0);
  const restOfText = text.slice(1);
  const handleFocus = () => {
    if (linkRef.current) {
      if (whatInput.ask() === 'keyboard') {
        linkRef.current.classList.add('invert-bg', 'invert-text');
      }
    }
  };

  const handleBlur = () => {
    if (linkRef.current) {
      linkRef.current.classList.remove('invert-bg', 'invert-text');
    }
  };
  // eslint-disable-next-line
  const handleKeyDown = (event: React.KeyboardEvent<HTMLSpanElement>) => {
    if (onClick) {
      onClick();
    }
  };
  useEffect(() => {}, []);
  return (
    <button
      ref={linkRef}
      tabIndex={0}
      className={`group text-center border-none cursor-pointer span-button ${disabled ? 'line-through' : ''}`}
      aria-label={ariaLabel}
      onClick={onClick && !disabled ? () => onClick() : undefined}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      type={type}
    >
      {decorationLeft && (
        <span className="text-center border-none cursor-pointer group-focus:href-blue group-focus:invert-bg">
          {decorationLeft}
        </span>
      )}
      <span className={`${className}`}>
        <span className="underline link-accent group-focus:link-accent-color-dark">
          {firstLetter}
        </span>
        <span className="group-hover:underline group-focus:link-color-dark">
          {restOfText}
        </span>
      </span>
      {decorationRight && (
        <span className="text-center border-none cursor-pointer group-focus:href-blue group-focus:invert-bg">
          {decorationRight}
        </span>
      )}
    </button>
  );
};

export default AccessibleButton;
