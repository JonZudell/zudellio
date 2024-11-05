import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the FontAwesome CSS
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { forwardRef, useState } from 'react';
import '../../main.css';

const tabEvent = new KeyboardEvent('keydown', {
  key: 'Tab',
  keyCode: 9,
  code: 'Tab',
  which: 9,
  bubbles: true,
  cancelable: true,
});

interface PasswordInputProps {
  value: string;
  setter: Function;
  id: string;
  name: string;
  className?: string;
  label?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ value, id, name, setter, className, label = 'Password' }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [focusedOnEye, setFocusedOnEye] = useState(false);

    return (
      <div className={`relative mt-2 ${className}`}>
        <label htmlFor={id} className="block mb-2">
          {label}
        </label>
        <div
          className={`flex items-center border standard-shadow focus-within:border-indigo-500`}
        >
          <input
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            id={id}
            name={name}
            value={value}
            className={`p-2 border textinput flex-grow background-color border-0 focus:border-indigo-500`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setter(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                if (ref && 'current' in ref && ref.current) {
                  ref.current.dispatchEvent(tabEvent);
                }
              }
            }}
            aria-describedby={`${id}-toggle`}
          />
          <span
            id={`${id}-toggle`}
            role="button" // Role for the toggle button
            className={`background-color inline-flex items-center font-semibold text-gray-900 border-0 hover:bg-gray-800 h-full`}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={0} // Make the span tabbable
            onFocus={() => {
              setFocusedOnEye(true);
            }}
            onBlur={() => {
              setFocusedOnEye(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                setShowPassword(!showPassword);
              }
            }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className={`m-3 h-4 w-4`}
              style={{
                color: `${focusedOnEye ? 'rgb(96 165 250)' : '#d3d3d3'}`,
              }} // Set the color here
            />
          </span>
        </div>
      </div>
    );
  },
);

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;
