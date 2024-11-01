import React, { useEffect, useRef } from 'react';
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
        buttonRef.current.classList.add('bg-offwhite');
        buttonRef.current.classList.add('text-offblack');
      }
    };

    const handleBlur = () => {
      if (buttonRef.current) {
        buttonRef.current.classList.remove('bg-offwhite');
        buttonRef.current.classList.remove('text-offblack');
      }
    };

    const buttonElement = buttonRef.current;
    if (buttonElement) {
      buttonElement.addEventListener('focus', handleFocus);
      buttonElement.addEventListener('blur', handleBlur);
    }

    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener('focus', handleFocus);
        buttonElement.removeEventListener('blur', handleBlur);
      }
    };
  }, []);
  return (
    <span
      ref={buttonRef}
      tabIndex={0} // Make the span focusable
      className={`group text-center border-none cursor-pointer`}
      onClick={onClick}
    >
      {decorationLeft && (
        <span className="text-center border-none cursor-pointer group-focus:text-blue-500 group-focus:bg-offwhite">
          {decorationLeft}
        </span>
      )}
      <span className={`group-hover:text-pink-300 ${className}`}>
        <span className="underline text-pink-500">{firstLetter}</span>
        <span className="group-hover:underline">{restOfText}</span>
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