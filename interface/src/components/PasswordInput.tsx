import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { forwardRef, useState } from 'react';

interface PasswordInputProps {
  value: string;
  setter: Function;
  id: string;
  name: string;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({ value, id, name, setter }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative mt-2 rounded-md shadow-sm">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={(e) => setter(e.target.value)}
        ref={ref}
        required
        data-testid={id + "-input"}
        className="mt-1 block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />
      <div
        className="cursor-pointer absolute inset-y-0 right-0 flex items-center pr-3"
        onClick={() => setShowPassword(!showPassword)}
      >
        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
      </div>
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput;