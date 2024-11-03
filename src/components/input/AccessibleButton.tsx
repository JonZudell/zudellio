import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import whatInput from 'what-input';
import "./AccessibleButton.css";
interface ButtonProps {
  text: string;
  decorationLeft?: string;
  decorationRight?: string;
  className?: string;
  onClick: Function;
}

const AccessibleLink: React.FC<ButtonProps> = ({ text, decorationLeft, decorationRight, className, onClick }) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const firstLetter = text.charAt(0);
  const restOfText = text.slice(1);

  useEffect(() => {
    const handleFocus = () => {
      if (linkRef.current) {
        if (whatInput.ask() === "keyboard") {
          linkRef.current.classList.add('invert-bg', 'invert-text');
        }
      }
    };

    const handleBlur = () => {
      if (linkRef.current) {
        linkRef.current.classList.remove('invert-bg', 'invert-text');
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      onClick();
    };

    const buttonElement = linkRef.current;
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
  }, []);
  return (
    <span
      ref={linkRef}
      tabIndex={0}
      className={`group text-center border-none cursor-pointer span-button`}
      role="button"
      onClick={onClick()}
      
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

export default AccessibleLink;