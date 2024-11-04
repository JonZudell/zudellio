import React from 'react';
import './TextInput.css';
interface TextInputProps {
  label?: string;
  className?: string;
  inputClassName?: string;
  inputRef?: React.Ref<HTMLInputElement>;
  type?:string;
  id?:string;
  name?:string;
  value?:string;
  onChange?: Function;
}

const TextInput: React.FC<TextInputProps> = ({ label, className, inputClassName, inputRef, type, id, name, value, onChange }) => {
  return (
    <div className={`${className}`}>
      <label className="block mb-2">{label}</label>
      <input 
        ref={inputRef} 
        type={type} 
        id={id}
        name={name}
        value={value}
        className={`border p-2 border-2 textinput ${inputClassName}`}
        onChange={onChange as React.ChangeEventHandler<HTMLInputElement>} />
    </div>
  );
};

export default TextInput;