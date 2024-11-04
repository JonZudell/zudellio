import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { forwardRef, useState } from 'react';
import "../../main.css"
interface PasswordInputProps {
  value: string;
  setter: Function;
  id: string;
  name: string;
  className?: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ value, id, name, setter, className }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`relative mt-2 rounded-md shadow-sm ${className}`}>
      <label htmlFor={id} className="block mb-2">Password</label>
      <div className="flex items-center">
        <input 
          ref={ref} 
          type={showPassword ? 'text' : 'password'} 
          id={id}
          name={name}
          value={value}
          className={`border p-2 border-2 textinput flex-grow`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value)} 
          aria-describedby={`${id}-toggle`}
        />
        <div
          id={`${id}-toggle`}
          className="background-color relative inline-flex items-center mx-10 font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 h-full"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <FontAwesomeIcon className="py-1em" icon={showPassword ? faEyeSlash : faEye} />
        </div>
      </div>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;