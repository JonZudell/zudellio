import React, { useEffect, useRef } from 'react';
import whatInput from 'what-input';
import "./Button.css";
interface ButtonProps {
  text: string;
  decorationLeft?: string;
  decorationRight?: string;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, decorationLeft, decorationRight, className, onClick }) => {
  const buttonRef = useRef<HTMLSpanElement>(null);
  const firstLetter = text.charAt(0);
  const restOfText = text.slice(1);
  useEffect(() => {
    const handleFocus = () => {
      if (buttonRef.current) {
        if (whatInput.ask() === "keyboard") {
          buttonRef.current.classList.add('invert-bg', 'invert-text');
        }
      }
    };

    const handleBlur = () => {
      if (buttonRef.current) {
        buttonRef.current.classList.remove('invert-bg', 'invert-text');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && buttonRef.current) {
        onClick?.();
      }
    };

    const buttonElement = buttonRef.current;
    if (buttonElement) {
      buttonElement.addEventListener('focus', handleFocus);
      buttonElement.addEventListener('blur', handleBlur);
      buttonElement.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener('focus', handleFocus);
        buttonElement.removeEventListener('blur', handleBlur);
        buttonElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [onClick]);
  return (
    <span
      ref={buttonRef}
      tabIndex={0} // Make the span focusable
      className={`group text-center border-none cursor-pointer span-button`}
      onClick={onClick}
      role="link"
    >
      {decorationLeft && (
        <span className="text-center border-none cursor-pointer group-focus:href-blue group-focus:invert-bg">
          {decorationLeft}
        </span>
      )}
      <span className={`${className}`}>
        <span className="underline link-accent group-focus:link-accent-color-dark">{firstLetter}</span>
        <span className="group-hover:underline group-focus:link-color-dark">{restOfText}</span>
      </span>
      {decorationRight && (
        <span className="text-center border-none cursor-pointer group-focus:href-blue group-focus:invert-bg">
          {decorationRight}
        </span>
      )}
    </span>
  );
};

export default Button;