import React, { useEffect, useRef } from 'react';
import whatInput from 'what-input';
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

  // const handleMouseEnter = () => {
  //   if (linkRef.current) {
  //     linkRef.current.classList.add(
  //       'focus-border-color',
  //       'hover:bg-custom',
  //       'hover:text-custom',
  //     );
  //   }
  // };

  // const handleMouseLeave = () => {
  //   if (linkRef.current) {
  //     linkRef.current.classList.remove(
  //       'focus-border-color',
  //       'hover:bg-custom',
  //       'hover:text-custom',
  //     );
  //   }
  // };

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
    <button
      ref={linkRef}
      tabIndex={0}
      className={`wrapper border-wrapper focus group cursor-pointer p-0-5em focus:outline-none focus:bg-custom focus:text-custom hover:bg-custom hover:text-custom`}
      aria-label={ariaLabel}
      onClick={onClick && !disabled ? () => onClick() : undefined}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      type={type}
    >
      <span className={`${className}`}>
        <span className="underline link-accent">{firstLetter}</span>
        <span className="group-hover:button-inner">{restOfText}</span>
      </span>
    </button>
  );
};

export default AccessibleButton;
