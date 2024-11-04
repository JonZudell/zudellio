import React from 'react';
import '../../main.css';
interface TextInputProps {
  label?: string;
  className?: string;
  inputClassName?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  type?: string;
  id?: string;
  name?: string;
  value?: string;
  required?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  tabIndex?: number;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  className,
  inputClassName,
  inputRef,
  type,
  id,
  name,
  value,
  onChange,
  tabIndex,
}) => {
  return (
    <div className={`${className}`}>
      <label className="block mb-2 text-lg">{label}</label>
      <input
        ref={inputRef}
        type={type}
        id={id}
        name={name}
        value={value}
        className={`border standard-shadow textinput ${inputClassName}`}
        onChange={onChange}
        tabIndex={tabIndex}
      />
    </div>
  );
};

export default TextInput;
