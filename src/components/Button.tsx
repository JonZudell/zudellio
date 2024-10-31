import React from 'react';

interface ButtonProps {
  text: string;
  decorationLeft?: string;
  decorationRight?: string;
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ text, decorationLeft, decorationRight, className, onClick }) => {
  const firstLetter = text.charAt(0);
  const restOfText = text.slice(1);

  return (
    <span
      tabIndex={0} // Make the span focusable
      className={`group text-center bg-transparent border-none cursor-pointer`}
      onClick={onClick}
    >
      {decorationLeft && (
        <span className="text-center bg-transparent border-none cursor-pointer">
          {decorationLeft}
        </span>
      )}
      <span className={`group-hover:text-pink-300 ${className}`}>
        <span className="underline text-pink-500">{firstLetter}</span>
        <span className="group-hover:underline">{restOfText}</span>
      </span>
      {decorationRight && (
        <span className="text-center bg-transparent border-none cursor-pointer">
          {decorationRight}
        </span>
      )}
    </span>
  );
};

export default Button;