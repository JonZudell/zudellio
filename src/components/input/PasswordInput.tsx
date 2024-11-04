import '@fortawesome/fontawesome-svg-core/styles.css'; // Import the FontAwesome CSS
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
    <div className={`relative mt-2 ${className}`}>
      <label htmlFor={id} className="block mb-2">Password</label>
      <div className="flex items-center standard-shadow">
        <input 
          ref={ref} 
          type={showPassword ? 'text' : 'password'} 
          id={id}
          name={name}
          value={value}
          className={`p-2 textinput flex-grow background-color`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value)} 
          aria-describedby={`${id}-toggle`}
        />
        <span
          id={`${id}-toggle`}
          className="background-color inline-flex items-center font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-800 h-full"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          <FontAwesomeIcon 
            icon={showPassword ? faEyeSlash : faEye} 
            className='m-3 h-4 w-4' 
            style={{ color: '#D3D3D3' }} // Set the color here
          />
        </span>
      </div>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;