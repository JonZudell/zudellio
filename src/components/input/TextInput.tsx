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
  required,
  onChange,
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
        required={required}
        className={`border standard-shadow textinput hover:textinput focus:textinput ${inputClassName}`}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInput;
