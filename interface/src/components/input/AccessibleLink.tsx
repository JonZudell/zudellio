import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import whatInput from 'what-input';
import './AccessibleLink.css';
interface ButtonProps {
  text: string;
  decorationLeft?: string;
  decorationRight?: string;
  className?: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  onClick?: Function;
  tabIndex?: number;
  ariaLabel: string;
}

const AccessibleLink: React.FC<ButtonProps> = ({
  text,
  decorationLeft,
  decorationRight,
  className,
  href,
  onClick,
  tabIndex,
  ariaLabel,
}) => {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const firstLetter = text.charAt(0);
  const restOfText = text.slice(1);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
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

    const handleKeyDown = (e: { key: string }) => {
      // if keydown is enter or space
      if (e.key === 'Enter' || e.key === ' ') {
        if (onClick) {
          onClick();
        } else {
          navigate(href);
        }
      }
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
  }, [href, navigate, onClick]);
  return (
    <Link
      ref={linkRef}
      className={`group text-center border-none cursor-pointer span-button focus:outline-none`}
      role="link"
      to={href}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
    >
      {decorationLeft && (
        <span className="text-center border-none cursor-pointer group-hover:text-blue-400 group-focus:text-blue-400">
          {decorationLeft}
        </span>
      )}
      <span className={`${className}`}>
        <span className="underline link-accent">{firstLetter}</span>
        <span className="group-hover:underline">{restOfText}</span>
      </span>
      {decorationRight && (
        <span className="text-center border-none cursor-pointer group-hover:text-blue-400 group-focus:text-blue-400">
          {decorationRight}
        </span>
      )}
    </Link>
  );
};

export default AccessibleLink;
