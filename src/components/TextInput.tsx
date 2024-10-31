import React from 'react';
import './TextInput.css';
interface TextInputProps {
  label?: string;
  className?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}

const TextInput: React.FC<TextInputProps> = ({ label, className, inputRef }) => {
  return (
    <div className={className}>
      <label className="block mb-2">{label}</label>
      <input ref={inputRef} className="border p-2 w-full border-2 textinput" />
    </div>
  );
};

export default TextInput;