import React, { useEffect, useRef } from 'react';
import whatInput from 'what-input';
import '../pages/index.css';
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
          buttonRef.current.classList.add('bg-offwhite', 'text-offblack');
        }
      }
    };

    const handleBlur = () => {
      if (buttonRef.current) {
        buttonRef.current.classList.remove('bg-offwhite', 'text-offblack');
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
        <span className="text-center border-none cursor-pointer group-focus:text-blue-500 group-focus:bg-offwhite">
          {decorationLeft}
        </span>
      )}
      <span className={`group-hover:text-pink-300 ${className}`}>
        <span className="underline text-pink-500 group-focus:text-pink-800">{firstLetter}</span>
        <span className="group-hover:underline group-focus:text-pink-500">{restOfText}</span>
      </span>
      {decorationRight && (
        <span className="text-center border-none cursor-pointer group-focus:text-blue-500">
          {decorationRight}
        </span>
      )}
    </span>
  );
};

export default Button;